import OpenButton from "./buttons/OpenButton";
import MenuAlt2Icon from "@heroicons/react/outline/MenuAlt2Icon";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import MenuAlt3Icon from "@heroicons/react/outline/MenuAlt3Icon";

export default function LyricOptions({ onAlignmentChange }) {
	return (
		<>
			<span className="px-3 border-r border-gray-300">
				<OpenButton hoverWeight={200} onClick={() => onAlignmentChange("left")}>
					<MenuAlt2Icon className="text-gray-500 h-4 w-4" />
				</OpenButton>
				<OpenButton
					hoverWeight={200}
					onClick={() => onAlignmentChange("center")}
				>
					<MenuIcon className="text-gray-500 h-4 w-4" />
				</OpenButton>
				<OpenButton
					hoverWeight={200}
					onClick={() => onAlignmentChange("right")}
				>
					<MenuAlt3Icon className="text-gray-500 h-4 w-4" />
				</OpenButton>
			</span>
		</>
	);
}
