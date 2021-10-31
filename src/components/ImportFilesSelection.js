import Button from "../components/Button";
import FilesInput from "../components/FilesInput";
import PageTitle from "../components/PageTitle";
import { pluralize } from "../utils/StringUtils";

export default function ImportFilesSelection({ filesToImport, onFilesChange, onImport }) {
	function handleRemove(fileToRemove) {
		onFilesChange(filesToImport.filter((file) => file !== fileToRemove));
	}

	return (
		<>
			<PageTitle title="Import songs" />
			<p className="text-lg leading-relaxed mb-8">
				You can import song files from your device and add it to your library in Cadence. Click the
				button below to browse and select files on your device. You can import Word documents, PDF
				files or regular text files.
			</p>
			<FilesInput
				onChange={onFilesChange}
				accept=".docx,.pdf,.txt,.chordpro"
				buttonText="Choose songs on device"
				onRemove={handleRemove}
			/>
			{filesToImport?.length > 0 && (
				<Button full onClick={onImport}>
					Import {filesToImport.length} {pluralize("song", filesToImport.length)}
				</Button>
			)}
		</>
	);
}
