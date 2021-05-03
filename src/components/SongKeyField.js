import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function SongKeyField({ songKey, onChange }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Key:</DetailTitle>
			<EditableData
				defaultValue={songKey}
				onChange={(editedValue) => console.log(editedValue)}
			/>
		</div>
	);
}
