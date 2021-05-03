import ChordOption from "./ChordOption";

export default function ChordOptions({ options, onBoldToggled }) {
	return (
		<>
			<div className="font-semibold py-3">Chord Options</div>
			<ChordOption
				optionName="Bold"
				on={options.bold}
				onChange={onBoldToggled}
			/>
		</>
	);
}
