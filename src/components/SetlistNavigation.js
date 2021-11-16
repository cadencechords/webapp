import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";

export default function SetlistNavigation({ songs, onIndexChange, index }) {
	return (
		<>
			<div className="fixed bottom-0 w-full flex border-t bg-white">
				<MobileMenuButton
					full
					disabled={index === 0}
					onClick={() => onIndexChange(index - 1)}
					className="border-r flex-center overflow-hidden overflow-ellipsis whitespace-nowrap"
				>
					{index === 0 ? (
						<span className="text-gray-500">Beginning</span>
					) : (
						<>
							<ArrowNarrowLeftIcon className="h-4 w-4 mr-2" /> {songs[index - 1]?.name}
						</>
					)}
				</MobileMenuButton>
				<MobileMenuButton
					full
					disabled={index >= songs.length - 1}
					onClick={() => onIndexChange(index + 1)}
					className="flex-center overflow-hidden overflow-ellipsis whitespace-nowrap"
				>
					{index === songs.length - 1 ? (
						<span className="text-gray-500">End</span>
					) : (
						<>
							{songs[index + 1]?.name} <ArrowNarrowRightIcon className="h-4 w-4 ml-2" />
						</>
					)}
				</MobileMenuButton>
			</div>
		</>
	);
}
