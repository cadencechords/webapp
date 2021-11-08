import Button from "../components/Button";
import PublicSetlistApi from "../api/PublicSetlistApi";
import StyledDialog from "../components/StyledDialog";
import { reportError } from "../utils/error";
import { useState } from "react";

export default function PublicSetlistDetailsDialog({
	publicSetlist,
	open,
	onCloseDialog,
	onUnpublished,
}) {
	const [loading, setLoading] = useState(false);

	const handleUnpublish = async () => {
		try {
			setLoading(true);
			await PublicSetlistApi.updateOne(publicSetlist.code, { expires_on: new Date() });
			setLoading(false);
			onUnpublished();
			onCloseDialog();
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog} borderedTop={false} fullscreen={false}>
			You can view this set at the following link:
			<a href={publicSetlist?.link} className="underline text-blue-600 my-4 block">
				{publicSetlist?.link}
			</a>
			<div className="flex justify-end">
				<Button loading={loading} onClick={handleUnpublish}>
					Unpublish
				</Button>
			</div>
		</StyledDialog>
	);
}
