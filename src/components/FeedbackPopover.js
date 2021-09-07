import AnnouncementIcon from "../icons/AnnouncementIcon";
import Button from "./Button";
import FeedbackApi from "../api/FeedbackApi";
import StyledPopover from "./StyledPopover";
import { selectTeamId } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function FeedbackPopover() {
	const [feedback, setFeedback] = useState("");
	const [loading, setLoading] = useState(false);
	const teamId = useSelector(selectTeamId);

	let button = <AnnouncementIcon className="w-7 h-7 transform -rotate-3 text-gray-600" />;

	const handleSubmit = async () => {
		try {
			setLoading(true);
			await FeedbackApi.create({ team_id: teamId, text: feedback });
			setFeedback("");
		} catch (error) {
			console.log(error);
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
					className="resize-y outline-none focus:outline-none p-3 w-72"
					placeholder="Submit feedback"
					value={feedback}
					onChange={(e) => setFeedback(e.target.value)}
				/>
				<div className="border-t text-right py-1.5 px-2 bg-gray-50 rounded-b-md">
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
