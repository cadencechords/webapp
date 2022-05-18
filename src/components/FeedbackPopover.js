import AnnouncementIcon from "../icons/AnnouncementIcon";
import Button from "./Button";
import StyledPopover from "./StyledPopover";

import { useState } from "react";
export default function FeedbackPopover() {
  const [feedback, setFeedback] = useState("");

  let button = (
    <AnnouncementIcon className="w-7 h-7 transform -rotate-3 text-gray-600 dark:text-dark-gray-200 mr-8" />
  );

  const isValid = () => {
    return feedback && feedback !== "";
  };

  return (
    <>
      <StyledPopover position="bottom-start" button={button}>
        <textarea
          className="resize-y outline-none focus:outline-none p-3 w-72 dark:bg-dark-gray-700 rounded-t-md"
          placeholder="Submit feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="border-t dark:border-dark-gray-400 text-right py-1.5 px-2 bg-gray-50 dark:bg-dark-gray-600 rounded-b-md">
          <Button color="blue" size="xs" disabled={!isValid()}>
            Submit
          </Button>
        </div>
      </StyledPopover>
    </>
  );
}
