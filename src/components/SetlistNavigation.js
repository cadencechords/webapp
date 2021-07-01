import { useState } from "react";
import MobileMenuButton from "./buttons/MobileMenuButton";

export default function SetlistNavigation({ songs, onSongIndexChange }) {
	const [songIndex, setSongIndex] = useState(0);

	const handleSongIndexChange = (newIndex) => {
		setSongIndex(newIndex);
		onSongIndexChange(newIndex);
	};

	return (
		<>
			<div className="fixed bottom-0 w-full flex border-t bg-white">
				<MobileMenuButton
					full
					disabled={songIndex === 0}
					onClick={() => handleSongIndexChange(songIndex - 1)}
					className="border-r"
				>
					{songIndex === 0 ? "Start" : songs[songIndex - 1].name}
				</MobileMenuButton>
				<MobileMenuButton
					full
					disabled={songIndex >= songs.length - 1}
					onClick={() => handleSongIndexChange(songIndex + 1)}
				>
					{songIndex === songs.length - 1 ? "End" : songs[songIndex + 1].name}
				</MobileMenuButton>
			</div>
		</>
	);
}
