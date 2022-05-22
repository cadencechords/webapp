import React, { useState } from "react";
import RolesApi from "../api/rolesApi";
import SetlistApi from "../api/SetlistApi";
import SongApi from "../api/SongApi";
import AddRoadmapChecklistTask from "./AddRoadmapChecklistTask";
import AddSetlistChecklistTask from "./AddSetlistChecklistTask";
import AddSongChecklistTask from "./AddSongChecklistTask";
import CreateRoleChecklistTask from "./CreateRoleChecklistTask";

export default function WelcomeChecklist() {
  const [isAddSongCompleted] = useState(checkIfAddSongIsCompleted);
  const [isAddRoadmapCompleted] = useState(checkIfAddRoadmapIsCompleted);
  const [isAddSetlistCompleted] = useState(checkIfAddSetlistIsCompleted);
  const [isAddRoleCompleted] = useState(checkIfAddRoleIsCompleted);

  function countCompletedTasks() {
    let numCompleted = 0;

    if (isAddSongCompleted) ++numCompleted;
    if (isAddRoadmapCompleted) ++numCompleted;
    if (isAddSetlistCompleted) ++numCompleted;
    if (isAddRoleCompleted) ++numCompleted;

    return numCompleted;
  }

  return (
    <div className="my-8 max-w-xl w-full">
      <div className="text-right">
        {countCompletedTasks()}/4 tasks completed
      </div>
      <ul className="my-2">
        <AddSongChecklistTask
          completed={isAddSongCompleted}
          showActionButton={!isAddSongCompleted}
        />
        <AddRoadmapChecklistTask
          completed={isAddRoadmapCompleted}
          showActionButton={isAddSongCompleted && !isAddRoadmapCompleted}
        />
        <AddSetlistChecklistTask
          completed={isAddSetlistCompleted}
          showActionButton={isAddSongCompleted && !isAddSetlistCompleted}
        />
        <CreateRoleChecklistTask
          completed={isAddRoleCompleted}
          showActionButton={!isAddRoleCompleted}
        />
      </ul>
    </div>
  );
}
function checkIfAddSongIsCompleted() {
  let songs = SongApi.getAll();
  return songs?.length > 0;
}

function checkIfAddRoadmapIsCompleted() {
  let songs = SongApi.getAll();
  return !!songs?.find((s) => !!s.roadmap);
}

function checkIfAddSetlistIsCompleted() {
  let { data: sets } = SetlistApi.getAll();
  return sets?.length > 0;
}

function checkIfAddRoleIsCompleted() {
  let { data: roles } = RolesApi.getAll();
  return roles?.length > 2;
}
