import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function MeterField({ meter, onChange }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Meter:</DetailTitle>
			<EditableData
				defaultValue={meter}
				onChange={(editedValue) => console.log(editedValue)}
			/>
		</div>
	);
}
