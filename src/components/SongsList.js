import { useState } from "react";
import CreateSongDialog from "./CreateSongDialog";
import NoDataMessage from "./NoDataMessage";
import PageTitle from "./PageTitle";
import QuickAdd from "./QuickAdd";
import SongsTable from "./SongsTable";

export default function SongsList() {
	const [isCreating, setIsCreating] = useState(false);

	return (
		<>
			<PageTitle title="Songs" />
			{/* <NoDataMessage type="song" /> */}
			<QuickAdd onAdd={() => setIsCreating(true)} />
			<CreateSongDialog
				open={isCreating}
				onCloseDialog={() => setIsCreating(false)}
			/>

			<SongsTable />
		</>
	);
}
