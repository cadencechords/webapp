import React from "react";
import SupportIcon from "../icons/SupportIcon";

export default function SupportButton() {
  function handleClick() {
    window.Beacon("toggle");
  }
  return (
    <button className="mr-8" variant="open" onClick={handleClick}>
      <SupportIcon className="w-6 h-6 text-gray-600 dark:text-dark-gray-200" />
    </button>
  );
}
