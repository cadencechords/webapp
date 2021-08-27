import StyledDialog from "./StyledDialog";
import Button from "./Button";
import { useState } from "react";
import PublicSetlistApi from "../api/PublicSetlistApi";
import { useParams } from "react-router-dom";

export default function PublishSetlistDialog({ open, onCloseDialog }) {
	const [publicSetlist, setPublicSetlist] = useState();
	const [generating, setGenerating] = useState(false);
	const id = useParams().id;

	const handleGenerateLink = async () => {
		setGenerating(true);
		try {
			let { data } = await PublicSetlistApi.createOne({ setlist_id: id });
			setPublicSetlist(data);
		} catch (error) {
			console.log(error);
		} finally {
			setGenerating(false);
		}
	};

	return (
		<StyledDialog title="Publish" open={open} onCloseDialog={onCloseDialog} borderedTop={false}>
			<p className="mb-4">
				Publishing the set will allow anyone with the generated link to view the lyrics to the songs
				in the set.
			</p>
			{publicSetlist && (
				<a href={publicSetlist.link} className="underline text-blue-600">
					{publicSetlist.link}
				</a>
			)}
			<div className="flex justify-end">
				<Button onClick={handleGenerateLink} disabled={Boolean(publicSetlist)} loading={generating}>
					Generate link
				</Button>
			</div>
		</StyledDialog>
	);
}
