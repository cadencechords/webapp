import React from "react";

export default function TrackSourceButton({
  source,
  icon,
  iconHeight = 25,
  iconWidth = 25,
  className,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={() => onClick(source)}
      className={
        `mr-4 flex items-center outline-none focus:outline-none transition-colors ` +
        ` hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-400 dark:focus:bg-dark-gray-400 ` +
        ` ${selected ? "bg-gray-100 dark:bg-dark-gray-400" : ""} ` +
        ` p-2 rounded-md ${className}`
      }
    >
      <img
        src={icon}
        alt="Track Source"
        width={iconWidth}
        height={iconHeight}
      />
      <span className="font-semibold ml-2">{source}</span>
    </button>
  );
}
