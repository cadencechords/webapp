import OpenButton from "./buttons/OpenButton";
import MenuAlt2Icon from "@heroicons/react/outline/MenuAlt2Icon";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import MenuAlt3Icon from "@heroicons/react/outline/MenuAlt3Icon";
import FontsListBox from "./FontsListBox";
import FontSizesListBox from "./FontSizesListBox";

export default function LyricOptions({
	onAlignmentChange,
	onFontChange,
	onFontSizeChange,
	formatOptions,
}) {
	return (
		<div className="flex items-center">
			<span className="px-3 border-r border-gray-300">
				<OpenButton hoverWeight={200} onClick={() => onAlignmentChange("left")}>
					<MenuAlt2Icon className="text-gray-500 h-4 w-4" />
				</OpenButton>
				<OpenButton hoverWeight={200} onClick={() => onAlignmentChange("center")}>
					<MenuIcon className="text-gray-500 h-4 w-4" />
				</OpenButton>
				<OpenButton hoverWeight={200} onClick={() => onAlignmentChange("right")}>
					<MenuAlt3Icon className="text-gray-500 h-4 w-4" />
				</OpenButton>
			</span>

			<span className="px-3 border-r border-gray-300 relative">
				<FontsListBox selectedFont={formatOptions.font} onChange={onFontChange} />
			</span>

			<span className="px-3 relative">
				<FontSizesListBox selectedFontSize={formatOptions.fontSize} onChange={onFontSizeChange} />
			</span>
		</div>
	);
}
