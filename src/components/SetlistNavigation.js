import MobileMenuButton from "./buttons/MobileMenuButton";

export default function SetlistNavigation({ songs, onIndexChange, index }) {
	return (
		<>
			<div className="fixed bottom-0 w-full flex border-t bg-white">
				<MobileMenuButton
					full
					disabled={index === 0}
					onClick={() => onIndexChange(index - 1)}
					className="border-r"
				>
					{index === 0 ? "Start" : songs[index - 1]?.name}
				</MobileMenuButton>
				<MobileMenuButton
					full
					disabled={index >= songs.length - 1}
					onClick={() => onIndexChange(index + 1)}
				>
					{index === songs.length - 1 ? "End" : songs[index + 1]?.name}
				</MobileMenuButton>
			</div>
		</>
	);
}
