import React from "react";
import ChecklistTask from "./ChecklistTask";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function AddSongChecklistTask({ completed, showActionButton }) {
  const actionButton = (
    <Link to="/songs">
      <Button variant="outlined">Add now</Button>
    </Link>
  );
  return (
    <ChecklistTask
      completed={completed}
      task="Add a song"
      actionButton={showActionButton && actionButton}
    />
  );
}
