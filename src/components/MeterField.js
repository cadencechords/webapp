import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";

export default function MeterField({ meter, onChange }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Meter:</DetailTitle>
			<EditableData value={meter ? meter : ""} onChange={onChange} placeholder="ex: 4/4" />
		</div>
	);
}
