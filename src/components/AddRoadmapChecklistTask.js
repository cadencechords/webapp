import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import ChecklistTask from "./ChecklistTask";

export default function AddRoadmapChecklistTask({
  completed,
  showActionButton,
}) {
  const actionButton = (
    <Link to="/songs">
      <Button variant="outlined">Add now</Button>
    </Link>
  );

  return (
    <ChecklistTask
      task="Add a roadmap to a song"
      completed={completed}
      actionButton={showActionButton && actionButton}
    />
  );
}
