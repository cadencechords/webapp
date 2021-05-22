import ChordOption from "./ChordOption";

export default function ChordOptions({ formatOptions, onBoldToggled }) {
	return (
		<>
			<div className="font-semibold py-3">Chord Options</div>
			<ChordOption optionName="Bold" on={formatOptions?.boldChords} onChange={onBoldToggled} />
		</>
	);
}
