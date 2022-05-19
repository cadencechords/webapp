import { useEffect, useRef, useState } from "react";

import BinderApi from "../api/BinderApi";
import Button from "./Button";
import ColorsList from "./ColorsList";
import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";

export default function CreateBinderDialog({ open, onCloseDialog, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("none");
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);

  const handleCloseDialog = () => {
    setName("");
    setDescription("");
    setColor("none");
    onCloseDialog();
  };

  const handleCreate = async () => {
    let result = BinderApi.createOne({ name, description, color });
    onCreated(result.data);
    handleCloseDialog();
  };

  return (
    <StyledDialog
      title="Create a new binder"
      open={open}
      onCloseDialog={handleCloseDialog}
    >
      <div className="mb-4 pt-2">
        <div className="mb-2">Name</div>
        <OutlinedInput
          placeholder="ex: Hymns"
          onChange={setName}
          ref={inputRef}
        />
      </div>

      <div className="mb-4">
        <div className="mb-2">Description</div>
        <OutlinedInput
          placeholder="ex: Common hymns"
          onChange={setDescription}
        />
      </div>

      <div className="mb-6">
        <div className="mb-2">Color</div>
        <ColorsList onChange={setColor} color={color} />
      </div>

      <Button full onClick={handleCreate}>
        Create
      </Button>
    </StyledDialog>
  );
}
