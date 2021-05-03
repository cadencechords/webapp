import OpenButton from "./buttons/OpenButton";
import OutlinedButton from "./buttons/OutlinedButton";
import PageTitle from "./PageTitle";
import PrinterIcon from "@heroicons/react/outline/PrinterIcon";
import PrintSongDialog from "./PrintSongDialog";
import { useState } from "react";
import DetailSection from "./DetailSection";
import ArtistField from "./ArtistField";
import BpmField from "./BpmField";
import MeterField from "./MeterField";
import SongKeyField from "./SongKeyField";
import SongPreview from "./SongPreview";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import { useHistory } from "react-router";

export default function SongDetail() {
	const [isPrintingOpen, setIsPrintingOpen] = useState(false);
	const [name, setName] = useState("Amazing Grace");
	const router = useHistory();

	const handleOpenInEditor = () => {
		router.push("/editor");
	};

	return (
		<div className="grid grid-cols-4">
			<div className="md:border-r md:pr-4 col-span-4 md:col-span-3">
				<div className="flex items-center justify-between">
					<PageTitle
						title="Amazing Grace"
						editable
						onChange={(editedName) => setName(editedName)}
					/>
					<OpenButton onClick={() => setIsPrintingOpen(true)}>
						<PrinterIcon className="text-gray-500 h-5 w-5" />
					</OpenButton>
				</div>

				<PrintSongDialog
					open={isPrintingOpen}
					onCloseDialog={() => setIsPrintingOpen(false)}
				/>
				<div className="mb-3">
					<OutlinedButton onClick={handleOpenInEditor}>
						<div className="flex flex-row items-center">
							<span className="mr-1">
								<PencilIcon className="w-4 h-4 text-blue-700" />
							</span>
							Edit Song
						</div>
					</OutlinedButton>
				</div>
				<SongPreview />
			</div>
			<div className="md:col-span-1 md:pl-5 pl-2">
				<div className="border-b py-6 mt-1">
					<ArtistField artist="Christ Tomlin" />
					<BpmField bpm="86" />
					<MeterField meter="4/4" />
					<SongKeyField songKey="Ab" />
				</div>
				<div className="py-6">
					<DetailSection title="Binders" />
					<DetailSection title="Genres" />
					<DetailSection title="Themes" />
				</div>
			</div>
		</div>
	);
}
