import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function SongKeyField({ songKey, onChange }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Key:</DetailTitle>
			<EditableData value={songKey ? songKey : ""} onChange={onChange} placeholder="Add the key" />
		</div>
	);
}
