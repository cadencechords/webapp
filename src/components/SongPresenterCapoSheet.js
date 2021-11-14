import CapoOptions from "./CapoOptions";
import CaposApi from "../api/caposApi";
import SectionTitle from "./SectionTitle";
import { reportError } from "../utils/error";

export default function SongPresenterCapoSheet({ song, onCapoChange }) {
	async function handleCapoChange(newCapo) {
		console.log();
		try {
			if (!song.capo) {
				onCapoChange({ capo_key: newCapo });
				let { data } = await CaposApi.create(newCapo, song.id);
				onCapoChange(data);
			} else {
				if (song.capo.capo_key !== newCapo) {
					onCapoChange({ ...song.capo, capo_key: newCapo });
					let { data } = await CaposApi.update(song.capo.id, song.id, { capo_key: newCapo });
					onCapoChange(data);
				}
			}
		} catch (error) {
			reportError(error);
		}
	}

	function handleRemoveCapo() {
		onCapoChange(null);
		if (song.capo) {
			try {
				CaposApi.delete(song.capo.id, song.id);
			} catch (error) {
				reportError(error);
			}
		}
	}

	return (
		<div>
			<SectionTitle title="Capo" className="pb-2 pl-2" />

			<CapoOptions song={song} onCapoChange={handleCapoChange} onRemoveCapo={handleRemoveCapo} />
		</div>
	);
}
