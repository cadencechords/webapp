import AnnouncementIcon from "../icons/AnnouncementIcon";
import Button from "./Button";
import FeedbackApi from "../api/FeedbackApi";
import StyledPopover from "./StyledPopover";
import { reportError } from "../utils/error";
import { selectCurrentUser, selectTeamId } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function FeedbackPopover() {
	const [feedback, setFeedback] = useState("");
	const [loading, setLoading] = useState(false);
	const teamId = useSelector(selectTeamId);
  const currentUser = useSelector(selectCurrentUser)

	let button = (
		<AnnouncementIcon className="mr-8 text-gray-600 transform w-7 h-7 -rotate-3 dark:text-dark-gray-200" />
	);

	const handleSubmit = async () => {
		try {
			setLoading(true);
			await FeedbackApi.create({ team_id: teamId, text: feedback, email: currentUser.email, platform: "web" });
			setFeedback("");
		} catch (error) {
			reportError(error);
		} finally {
			setLoading(false);
		}
	};

	const isValid = () => {
		return feedback && feedback !== "";
	};

	return (
		<>
			<StyledPopover position="bottom-start" button={button}>
				<textarea
					className="p-3 outline-none resize-y focus:outline-none w-72 dark:bg-dark-gray-700 rounded-t-md"
					placeholder="Submit feedback"
					value={feedback}
					onChange={(e) => setFeedback(e.target.value)}
				/>
				<div className="border-t dark:border-dark-gray-400 text-right py-1.5 px-2 bg-gray-50 dark:bg-dark-gray-600 rounded-b-md">
					<Button
						onClick={handleSubmit}
						color="blue"
						size="xs"
						loading={loading}
						disabled={!isValid()}
					>
						Submit
					</Button>
				</div>
			</StyledPopover>
		</>
	);
}
