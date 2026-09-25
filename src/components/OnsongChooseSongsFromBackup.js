import Button from "../components/Button";
import OnsongsSongsList from "../components/OnsongSongsList";
import PageLoading from "./PageLoading";
import Icon from './Icon';

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
							<Icon name="arrow_back" className="w-5 h-5 mr-2" /> Back
						</div>
					</Button>
					<Button
						disabled={selectedSongs?.length === 0}
						loading={importing}
						onClick={onConfirmSongSelection}
					>
						<div className="flex-center">
							Choose Binder
							<Icon name="arrow_forward" className="w-5 h-5 ml-2" />
						</div>
					</Button>
				</div>
			</>
		);
	}
}
