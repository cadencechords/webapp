import { useEffect, useState } from "react";

import Button from "./Button";
import PublicSetlistApi from "../api/PublicSetlistApi";
import StyledDialog from "./StyledDialog";
import { reportError } from "../utils/error";
import { useParams } from "react-router-dom";

export default function PublishSetlistDialog({ open, onCloseDialog, onSetlistPublished }) {
	const [publicSetlist, setPublicSetlist] = useState();
	const [generating, setGenerating] = useState(false);
	const id = useParams().id;

	useEffect(() => {
		setPublicSetlist(null);
		setGenerating(false);
	}, [open]);

	const handleGenerateLink = async () => {
		setGenerating(true);
		try {
			let { data } = await PublicSetlistApi.createOne({ setlist_id: id });
			setPublicSetlist(data);
			onSetlistPublished(data);
			onCloseDialog();
		} catch (error) {
			reportError(error);
		} finally {
			setGenerating(false);
		}
	};

	return (
		<StyledDialog
			title="Publish"
			open={open}
			onCloseDialog={onCloseDialog}
			borderedTop={false}
			fullscreen={false}
		>
			<p className="mb-4">
				Publishing the set will allow anyone with the generated link to view the lyrics to the songs
				in the set.
			</p>
			{publicSetlist && (
				<a href={publicSetlist.link} className="underline text-blue-600 block my-4">
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
