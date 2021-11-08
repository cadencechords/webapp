import Button from "./Button";
import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import PcoApi from "../api/PlanningCenterApi";
import SectionTitle from "./SectionTitle";
import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { reportError } from "../utils/error";
import { setCurrentUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function Integrations({ currentUser }) {
	const [isDisconnectingPco, setIsDisconnectingPco] = useState(false);
	const dispatch = useDispatch();

	const handleDisconnectPco = async () => {
		setIsDisconnectingPco(true);
		try {
			await PcoApi.disconnect();
			dispatch(setCurrentUser({ ...currentUser, pco_connected: false }));
		} catch (error) {
			reportError(error);
		} finally {
			setIsDisconnectingPco(false);
		}
	};

	return (
		<div className="mb-8">
			<SectionTitle title="Integrations" underline />
			<div className="flex-between">
				<div className="flex-center">
					{currentUser.pco_connected ? (
						<CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
					) : (
						<XCircleIcon className="w-4 h-4 text-gray-400 mr-2" />
					)}
					Planning Center
				</div>
				{currentUser.pco_connected && (
					<Button
						size="xs"
						variant="outlined"
						color="black"
						onClick={handleDisconnectPco}
						loading={isDisconnectingPco}
					>
						Disconnect
					</Button>
				)}
			</div>
		</div>
	);
}
