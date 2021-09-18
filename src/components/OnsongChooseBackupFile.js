import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import Button from "../components/Button";
import FileInput from "./FileInput";
import XIcon from "@heroicons/react/outline/XIcon";

export default function OnsongChooseBackupFile({
	onBackupFileChosen,
	onReset,
	backup,
	onChooseSongs,
	onCancel,
}) {
	return (
		<>
			<div className="mb-10">
				<p className="text-lg mb-10">
					To import songs from Onsong, you'll need to export your library in the Onsong app first.
					You can learn more about exporting from Onsong{" "}
					<a
						href="https://onsongapp.com/docs/interface/menubar/share-menu/export/"
						rel="noreferrer"
						className="underline text-blue-600"
						target="_blank"
					>
						here
					</a>
					. Choose the OnSong Backup option. This will save your library to a single file that
					you'll be able to import by clicking the button below.
				</p>

				<FileInput accept=".backup" onChange={onBackupFileChosen} onRemove={onReset} />
				{backup && (
					<div className="flex-between border rounded-md p-3 my-4">
						{backup.name}
						<Button size="xs" variant="open" onClick={onReset}>
							<XIcon className="w-5 h-5 text-gray-500" />
						</Button>
					</div>
				)}
			</div>
			<div className="flex-between">
				<Button variant="open" color="gray" bold onClick={onCancel}>
					<div className="flex-center">Cancel</div>
				</Button>
				<Button disabled={!backup} onClick={onChooseSongs}>
					<div className="flex-center">
						Choose songs
						<ArrowNarrowRightIcon className="w-5 h-5 ml-2" />
					</div>
				</Button>
			</div>
		</>
	);
}
