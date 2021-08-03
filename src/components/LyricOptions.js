import MenuAlt2Icon from "@heroicons/react/outline/MenuAlt2Icon";
import MenuIcon from "@heroicons/react/outline/MenuIcon";
import MenuAlt3Icon from "@heroicons/react/outline/MenuAlt3Icon";
import FontsListBox from "./FontsListBox";
import FontSizesListBox from "./FontSizesListBox";
import Button from "./Button";

export default function LyricOptions({
	onAlignmentChange,
	onFontChange,
	onFontSizeChange,
	formatOptions,
}) {
	return (
		<div className="flex items-center">
			<span className="px-3 border-r border-gray-300">
				<Button
					size="xs"
					variant="open"
					hoverWeight={200}
					onClick={() => onAlignmentChange("left")}
				>
					<MenuAlt2Icon className="text-gray-500 h-4 w-4" />
				</Button>
				<Button size="xs" variant="open" onClick={() => onAlignmentChange("center")}>
					<MenuIcon className="text-gray-500 h-4 w-4" />
				</Button>
				<Button size="xs" variant="open" onClick={() => onAlignmentChange("right")}>
					<MenuAlt3Icon className="text-gray-500 h-4 w-4" />
				</Button>
			</span>

			<div className="px-3 border-r border-gray-300 w-32 relative">
				<FontsListBox selectedFont={formatOptions.font} onChange={onFontChange} />
			</div>

			<div className="px-3 relative w-24">
				<FontSizesListBox selectedFontSize={formatOptions.font_size} onChange={onFontSizeChange} />
			</div>
		</div>
	);
}
