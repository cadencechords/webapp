import React from "react";
import { noop } from "../utils/constants";
import Checkbox from "./Checkbox";

export default function ChecklistTask({ task, completed, actionButton }) {
  return (
    <li className="mb-2 p-3 h-14 flex-between items-center rounded-md bg-gray-100 dark:bg-dark-gray-800">
      <div className="flex items-center">
        <Checkbox checked={completed} checkable={noop} className="mr-4" />
        {task}
      </div>
      {!completed && actionButton}
    </li>
  );
}
