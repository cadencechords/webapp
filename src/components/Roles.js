import { ADD_ROLES } from "../utils/constants";
import Card from "./Card";
import CreateRoleDialog from "../dialogs/CreateRoleDialog";
import PlusCircleIcon from "@heroicons/react/outline/PlusCircleIcon";
import RoleCard from "./RoleCard";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Roles({ roles }) {
	const currentMember = useSelector(selectCurrentMember);
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	return (
		<div className="grid grid=cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
			{roles?.map((role) => (
				<RoleCard key={role.id} role={role} />
			))}
			{currentMember.can(ADD_ROLES) && (
				<>
					<Card
						onClick={() => setShowCreateDialog(true)}
						className="cursor-pointer flex-center text-gray-600 font-medium hover:bg-gray-200 focus:bg-gray-200 transition-colors"
					>
						<PlusCircleIcon className="w-4 h-4 mr-2" />
						New role
					</Card>
					<CreateRoleDialog
						open={showCreateDialog}
						onCloseDialog={() => setShowCreateDialog(false)}
					/>
				</>
			)}
		</div>
	);
}
