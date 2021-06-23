import Drawer from "./Drawer";
import Toggle from "./Toggle";

export default function SongAdjustmentsDrawer({ open, onClose, song, onAdjustmentMade }) {
	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		if (adjustmentField === "showChordsDisabled") {
			localStorage.setItem(`show_chords_disabled_song_${song.id}`, adjustmentValue);
		}

		onAdjustmentMade(adjustmentField, adjustmentValue);
	};

	return (
		<>
			<Drawer open={open} onClose={onClose}>
				<div className="flex flex-col px-3 pt-5">
					<Toggle
						enabled={!song.showChordsDisabled}
						label="Show chords"
						onChange={(enabled) => handleAdjustmentMade("showChordsDisabled", !enabled)}
						spacing="between"
					/>
				</div>
			</Drawer>
		</>
	);
}
