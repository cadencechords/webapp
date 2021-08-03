import ChordOption from "./ChordOption";

export default function ChordOptions({ formatOptions, onBoldToggled, onItalicsToggled }) {
	return (
		<>
			<div className="font-semibold py-3">Chord Options</div>
			<ChordOption optionName="Bold" on={formatOptions?.bold_chords} onChange={onBoldToggled} />
			<ChordOption
				optionName="Italicized"
				on={formatOptions?.italic_chords}
				onChange={onItalicsToggled}
			/>
		</>
	);
}
