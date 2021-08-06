import Drawer from "./Drawer";
import Toggle from "./Toggle";

export default function SongAdjustmentsDrawer({
	open,
	onClose,
	song,
	onAdjustmentMade,
	onToggleTranspose,
	transposing,
}) {
	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		if (adjustmentField === "showChordsDisabled") {
			localStorage.setItem(`show_chords_disabled_song_${song.id}`, adjustmentValue);
		}

		onAdjustmentMade(adjustmentField, adjustmentValue);
	};

	return (
		<>
			<Drawer open={open} onClose={onClose}>
				<div className="flex flex-col px-3 pt-5 gap-3">
					<Toggle
						enabled={!song.showChordsDisabled}
						label="Show chords"
						onChange={(enabled) => handleAdjustmentMade("showChordsDisabled", !enabled)}
						spacing="between"
					/>

					<Toggle
						enabled={transposing}
						label="Transpose"
						onChange={onToggleTranspose}
						spacing="between"
					/>
				</div>
			</Drawer>
		</>
	);
}
