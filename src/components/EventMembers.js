import { useEffect, useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import PageLoading from "../components/PageLoading";
import ProfilePicture from "../components/ProfilePicture";
import TeamApi from "../api/TeamApi";
import WellInput from "../components/inputs/WellInput";
import { hasName } from "../utils/model";

export default function EventMembers({
	event,
	onMembersLoaded,
	members,
	onFieldChange,
	onPreviousClick,
	onNextClick,
}) {
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
				console.log(error);
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
		if (event.members?.includes(member)) {
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
							className="p-2 last:border-0 border-b flex items-center gap-4 cursor-pointer"
							onClick={() => handleToggleMember(member)}
						>
							<Checkbox onChange={() => {}} checked={event.members?.includes(member)} />
							<ProfilePicture url={member.user.image_url} size="xs" />
							<div>
								{hasName(member.user) && (
									<div className="font-semibold text-lg">
										{member.user.first_name} {member.user.last_name}
									</div>
								)}
								<div>{member.user.email}</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex-between">
					<Button
						variant="open"
						color="gray"
						className="flex items-center gap-2"
						onClick={onPreviousClick}
					>
						<ArrowNarrowLeftIcon className="w-4 h-4" />
						Details
					</Button>
					<Button className="flex items-center gap-2" onClick={onNextClick}>
						Notifications
						<ArrowNarrowRightIcon className="w-4 h-4" />
					</Button>
				</div>
			</div>
		);
	}
}
