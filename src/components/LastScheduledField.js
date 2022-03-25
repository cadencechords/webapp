import React from "react";
import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function LastScheduledField({ latestSetlist }) {
  return (
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>Last scheduled:</DetailTitle>
      <EditableData value={latestSetlist || "Never"} editable={false} />
    </div>
  );
}
