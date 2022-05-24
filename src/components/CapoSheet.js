import { useEffect, useState } from "react";

import Button from "./Button";
import CapoOptions from "./CapoOptions";
import CaposApi from "../api/caposApi";
import SectionTitle from "./SectionTitle";

export default function CapoSheet({ song, onCapoChange, className }) {
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

  function handleSaveChanges() {
    if (updates.capo_key === null && updates.id) {
      CaposApi.delete(updates.id, song.id);
    } else if (updates.capo_key !== null && song.capo?.id) {
      let { data } = CaposApi.update(song.capo.id, song.id, updates);
      onCapoChange(data);
    } else if (updates.capo_key !== null && !song.capo?.id) {
      let { data } = CaposApi.create(updates.capo_key, song.id);
      onCapoChange(data);
    }

    setUpdates(null);
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
                onClick={handleSaveChanges}
              >
                Save changes
              </Button>
            )}
          </>
        }
        className="pb-2 pl-2"
      />

      <CapoOptions
        song={song}
        onCapoChange={handleCapoChange}
        onRemoveCapo={handleRemoveCapo}
      />
    </div>
  );
}

CapoSheet.defaultProps = {
  className: "",
};
