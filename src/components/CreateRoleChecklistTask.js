import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import ChecklistTask from "./ChecklistTask";

export default function CreateRoleChecklistTask({
  completed,
  showActionButton,
}) {
  const actionButton = (
    <Link to="/permissions">
      <Button variant="outlined">Add now</Button>
    </Link>
  );

  return (
    <ChecklistTask
      task="Create a role with permissions"
      completed={completed}
      actionButton={showActionButton && actionButton}
    />
  );
}
