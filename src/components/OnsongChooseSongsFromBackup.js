import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import Button from "../components/Button";
import OnsongsSongsList from "../components/OnsongSongsList";
import PageLoading from "./PageLoading";

export default function OnsongChooseSongsFromBackup({
	uploading,
	unzippedFiles,
	selectedSongs,
	onSongToggled,
	onSelectAll,
	onUnselectAll,
	importing,
	onBackClick,
	onConfirmSongSelection,
}) {
	if (uploading) {
		return <PageLoading>We are pulling up your files now</PageLoading>;
	} else {
		return (
			<>
				<OnsongsSongsList
					songs={unzippedFiles}
					selectedSongs={selectedSongs}
					onToggleSong={onSongToggled}
					onSelectAll={onSelectAll}
					onUnselectAll={onUnselectAll}
				/>
				<div className="flex-between">
					<Button variant="open" color="gray" bold onClick={onBackClick}>
						<div className="flex-center">
							<ArrowNarrowLeftIcon className="w-5 h-5 mr-2" /> Back
						</div>
					</Button>
					<Button
						disabled={selectedSongs?.length === 0}
						loading={importing}
						onClick={onConfirmSongSelection}
					>
						<div className="flex-center">
							Choose Binder
							<ArrowNarrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</Button>
				</div>
			</>
		);
	}
}
