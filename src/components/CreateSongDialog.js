import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import OrDivider from "./OrDivider";
import OutlinedInput from "./inputs/OutlinedInput";
import SongApi from "../api/SongApi";
import StyledDialog from "./StyledDialog";
import { reportError } from "../utils/error";
import { useHistory } from "react-router";

export default function CreateSongDialog({ open, onCloseDialog, onCreate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useHistory();
  const inputRef = useRef();

  const canCreate = Boolean(name);

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      let result = await SongApi.createOne({ name });
      if (onCreate) {
        setName("");
        onCreate(result.data);
        onCloseDialog();
      }
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog
      title="Create a new song"
      open={open}
      onCloseDialog={onCloseDialog}
      size="lg"
    >
      <div className="mb-4">
        <div className="mb-2">Name</div>
        <OutlinedInput
          placeholder="ex: Amazing Grace"
          value={name}
          onChange={setName}
          ref={inputRef}
        />
      </div>

      <Button
        full
        disabled={!canCreate}
        loading={loading}
        onClick={handleCreate}
      >
        Create Song
      </Button>

      <OrDivider />

      <Button
        variant="open"
        full
        color="blue"
        onClick={() => router.push("/import")}
      >
        Import a song
      </Button>
    </StyledDialog>
  );
}
