import { useEffect, useState } from "react";

import Button from "./Button";
import CapoOptions from "./CapoOptions";
import CaposApi from "../api/caposApi";
import SectionTitle from "./SectionTitle";
import { reportError } from "../utils/error";

export default function CapoSheet({ song, onCapoChange, className }) {
	const [saving, setSaving] = useState(false);
	const [updates, setUpdates] = useState();

	useEffect(() => {
		setUpdates(null);
	}, [song.id]);

	async function handleCapoChange(newCapo) {
		setUpdates({ capo_key: newCapo });
		onCapoChange({ ...song.capo, capo_key: newCapo });
	}

	function handleRemoveCapo() {
		let updates = { capo_key: null };

		if (song.capo) {
			updates.id = song.capo.id;
		}

		setUpdates(updates);
		onCapoChange(null);
	}

	async function handleSaveChanges() {
		try {
			setSaving(true);

			if (updates.capo_key === null && updates.id) {
				await CaposApi.delete(updates.id, song.id);
			} else if (updates.capo_key !== null && song.capo?.id) {
				let { data } = await CaposApi.update(song.capo.id, song.id, updates);
				onCapoChange(data);
			} else if (updates.capo_key !== null && !song.capo?.id) {
				let { data } = await CaposApi.create(updates.capo_key, song.id);
				onCapoChange(data);
			}

			setUpdates(null);
		} catch (error) {
			reportError(error);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className={className}>
			<SectionTitle
				title={
					<>
						Capo{" "}
						{updates && (
							<Button
								className="ml-4"
								size="xs"
								variant="open"
								loading={saving}
								onClick={handleSaveChanges}
							>
								Save changes
							</Button>
						)}
					</>
				}
				className="pb-2 pl-2"
			/>

			<CapoOptions song={song} onCapoChange={handleCapoChange} onRemoveCapo={handleRemoveCapo} />
		</div>
	);
}

CapoSheet.defaultProps = {
	className: "",
};
