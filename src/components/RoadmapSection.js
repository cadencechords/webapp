import { useRef, useState } from "react";

export default function RoadmapSection({ section, color, onChange, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	const ref = useRef();

	function determineWidth() {
		return section.length + 3 + "ch";
	}

	function handleKeyDown(key) {
		if (key === "Backspace" && section === "") onDelete();
		if (key === "Enter") ref.current.blur();
	}

	function handleDoubleClick() {
		setIsEditing(true);
		ref.current?.focus();
	}
	return isEditing ? (
		<input
			ref={ref}
			value={section || ""}
			onChange={(e) => onChange?.(e.target.value)}
			className="bg-gray-50 dark:bg-dark-gray-800 focus:outline-none outline-none border dark:border-dark-gray-400 rounded-md p-1.5 text-sm"
			style={{ width: determineWidth() }}
			onBlur={() => setIsEditing(false)}
			onKeyDown={(e) => handleKeyDown(e.key)}
		/>
	) : (
		<span
			onDoubleClick={handleDoubleClick}
			className="bg-gray-50 dark:bg-dark-gray-900 focus:outline-none outline-none border dark:border-dark-gray-400 rounded-md p-1.5 text-sm"
		>
			{section}
		</span>
	);
}
