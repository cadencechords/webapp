import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import Range from "./Range";
import StopIcon from "@heroicons/react/solid/StopIcon";

export default function SongAdjustmentsDrawerAutoscrollSheet({
	onShowMainSheet,
	song,
	onSongChange,
	autoScrolling,
	onToggleAutoScrolling,
}) {
	const iconClasses = "w-5 h-5 mr-3 text-blue-600";
	return (
		<div>
			<MobileMenuButton full className="text-left flex items-center" onClick={onShowMainSheet}>
				<ArrowNarrowLeftIcon className="w-5 h-5 mr-3" /> Back
			</MobileMenuButton>
			<h1 className="px-6 font-medium py-3">Auto scroll</h1>
			<MobileMenuButton
				full
				className="flex items-center text-left"
				onClick={onToggleAutoScrolling}
			>
				{autoScrolling ? (
					<>
						<StopIcon className={iconClasses} />
						Stop
					</>
				) : (
					<>
						<PlayIcon className={iconClasses} />
						Start
					</>
				)}
			</MobileMenuButton>
			<div className="mt-32">
				<Range
					step={1}
					max={10}
					min={1}
					value={song.scroll_speed || 1}
					onChange={(e) => onSongChange("scroll_speed", e)}
				/>
			</div>
		</div>
	);
}
