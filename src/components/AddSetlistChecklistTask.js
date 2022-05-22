import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import ChecklistTask from "./ChecklistTask";

export default function AddSetlistChecklistTask({
  completed,
  showActionButton,
}) {
  const actionButton = (
    <Link to="/sets">
      <Button variant="outlined">Add now</Button>
    </Link>
  );

  return (
    <ChecklistTask
      task="Add a set"
      completed={completed}
      actionButton={showActionButton && actionButton}
    />
  );
}
