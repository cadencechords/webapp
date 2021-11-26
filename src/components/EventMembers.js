import { useEffect, useState } from "react";

import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import PageLoading from "../components/PageLoading";
import TeamApi from "../api/TeamApi";
import WellInput from "../components/inputs/WellInput";
import { hasName } from "../utils/model";
import { reportError } from "../utils/error";

export default function EventMembers({ event, onMembersLoaded, members, onFieldChange }) {
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState("");
	const [filteredMembers, setFilteredMembers] = useState(members);

	useEffect(() => {
		async function fetchMembers() {
			try {
				setLoading(true);
				let { data } = await TeamApi.getMemberships();
				onMembersLoaded(data);
				setFilteredMembers(data);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		if (!members) {
			fetchMembers();
		}
	}, [onMembersLoaded, members]);

	function handleQueryChange(newQuery) {
		setQuery(newQuery.toLowerCase());
		setFilteredMembers(members.filter((member) => matchesNameOrEmail(member, newQuery)));
	}

	function matchesNameOrEmail(member, query) {
		if (query === "") {
			return true;
		}
		if (hasName(member.user)) {
			if (
				member.user.first_name.toLowerCase().includes(query) ||
				member.user.last_name.toLowerCase().includes(query)
			) {
				return true;
			}
		}
		if (member.user.email.toLowerCase().includes(query)) {
			return true;
		}
		return false;
	}

	function handleToggleMember(member) {
		let updatedMembers = [];
		if (event.members?.find((memberInList) => member.id === memberInList.id)) {
			updatedMembers = event.members.filter((memberInEvent) => memberInEvent.id !== member.id);
		} else {
			updatedMembers = [...event.members, member];
		}

		onFieldChange("members", updatedMembers);
	}

	function handleCheckAll() {
		onFieldChange("members", members);
	}

	function handleUncheckAll() {
		onFieldChange("members", []);
	}

	if (loading || !members) {
		return <PageLoading />;
	} else {
		return (
			<div>
				<div className="sm:hidden font-semibold mb-5">Members</div>
				<WellInput autoFocus onChange={handleQueryChange} value={query} />
				<div className="my-4">
					<Button variant="open" size="xs" className="mr-2" onClick={handleCheckAll}>
						Check all
					</Button>
					<Button variant="open" size="xs" onClick={handleUncheckAll}>
						Uncheck all
					</Button>
					{filteredMembers.map((member) => (
						<div
							key={member.id}
							className="p-2 last:border-0 border-b dark:border-dark-gray-400 flex items-center gap-4 cursor-pointer"
							onClick={() => handleToggleMember(member)}
						>
							<Checkbox
								onChange={() => {}}
								checked={event.members.find((eventMember) => eventMember.id === member.id)}
							/>
							<div>
								{hasName(member.user) ? (
									<>
										{member.user.first_name} {member.user.last_name}
									</>
								) : (
									member.user.email
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}
