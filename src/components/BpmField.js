import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function BpmField({ bpm, onChange, editable }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>BPM:</DetailTitle>
			<EditableData
				value={bpm ? bpm : ""}
				onChange={onChange}
				placeholder="Add bpm"
				editable={editable}
			/>
		</div>
	);
}
