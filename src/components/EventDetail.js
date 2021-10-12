import { DELETE_EVENTS, EDIT_EVENTS } from "../utils/constants";

import BellIcon from "@heroicons/react/outline/BellIcon";
import Button from "./Button";
import MenuAlt2Icon from "@heroicons/react/outline/MenuAlt2Icon";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import UsersIcon from "@heroicons/react/solid/UsersIcon";
import { format } from "../utils/date";
import { hasName } from "../utils/model";

export default function EventDetail({ event, currentMember, onDelete, onEdit }) {
	return (
		<>
			{event && (
				<div className="grid grid-cols-10 gap-3 md:gap-6">
					<div className="col-span-1 flex justify-end items-start">
						<UsersIcon className="text-gray-600 w-5 h-5 my-1" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event?.memberships?.length > 0 ? (
							event.memberships.map((member) => (
								<div key={member.id} className="my-1">
									{hasName(member.user)
										? `${member.user.first_name} ${member.user.last_name}`
										: member.user.email}
								</div>
							))
						) : (
							<div className="text-gray-600">No members</div>
						)}
					</div>
					<div className="col-span-1 flex justify-end items-start">
						<BellIcon className="text-gray-600 w-5 h-5" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event.reminders_enabled ? (
							`Reminders will be sent ${format(event.reminder_date, "MMMM D, YYYY h:mma")}`
						) : (
							<div className="text-gray-600">Reminders are not enabled for this event</div>
						)}
					</div>

					<div className="col-span-1 flex justify-end items-start">
						<MenuAlt2Icon className="text-gray-600 w-5 h-5" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event.description ? (
							event.description
						) : (
							<div className="text-gray-600">No description provided for this event</div>
						)}
					</div>
				</div>
			)}
			<div className="mt-4 flex justify-end">
				{currentMember?.can(EDIT_EVENTS) && (
					<Button variant="open" color="gray" onClick={onEdit}>
						<PencilIcon className="h-5 w-5" />
					</Button>
				)}
				{currentMember?.can(DELETE_EVENTS) && (
					<Button variant="open" color="red" onClick={onDelete}>
						<TrashIcon className="h-5 w-5" />
					</Button>
				)}
			</div>
		</>
	);
}
