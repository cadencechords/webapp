import EditableData from "./inputs/EditableData";
import DetailTitle from "./DetailTitle";

export default function ArtistField({ onChange, artist }) {
	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Artist:</DetailTitle>
			<EditableData value={artist ? artist : ""} onChange={onChange} placeholder="Add an artist" />
		</div>
	);
}
