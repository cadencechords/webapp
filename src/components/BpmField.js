import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function BpmField({ bpm, onChange }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>BPM:</DetailTitle>
			<EditableData
				defaultValue={bpm}
				onChange={(editedValue) => console.log(editedValue)}
			/>
		</div>
	);
}
