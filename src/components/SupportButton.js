import React from "react";
import { useSelector } from "react-redux";
import SupportIcon from "../icons/SupportIcon";
import { selectCurrentUser } from "../store/authSlice";

export default function SupportButton() {
  const currentUser = useSelector(selectCurrentUser);

  function handleClick() {
    window.Beacon("identify", {
      email: currentUser?.email,
    });
    window.Beacon("toggle");
  }
  return (
    <button className="mr-8" variant="open" onClick={handleClick}>
      <SupportIcon className="w-6 h-6 text-gray-600 dark:text-dark-gray-200" />
    </button>
  );
}
