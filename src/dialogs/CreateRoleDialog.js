import Button from "../components/Button";
import OutlinedInput from "../components/inputs/OutlinedInput";
import RolesApi from "../api/rolesApi";
import StyledDialog from "../components/StyledDialog";
import { useHistory } from "react-router-dom";
import { useState } from "react";

export default function CreateRoleDialog({ open, onCloseDialog }) {
  const [role, setRole] = useState({});
  const router = useHistory();

  function handleFieldUpdate(field, value) {
    setRole((currentRole) => ({ ...currentRole, [field]: value }));
  }

  function handleClose() {
    setRole({});
    onCloseDialog();
  }

  function handleCreate() {
    let { data } = RolesApi.createOne(role);
    router.push(`/permissions/${data.id}`);
  }

  return (
    <StyledDialog
      open={open}
      borderedTop={false}
      onCloseDialog={handleClose}
      title="New role"
      fullscreen={false}
    >
      <div className="mb-4 pt-2">
        <div className="mb-2">
          Name <span className="text-red-600">*</span>
        </div>
        <OutlinedInput
          placeholder="ex: Editors"
          onChange={(value) => handleFieldUpdate("name", value)}
        />
      </div>

      <div className="mb-4 pt-2">
        <div className="mb-2">Description</div>
        <OutlinedInput
          placeholder="Brief summary of what this role is being created for"
          onChange={(value) => handleFieldUpdate("description", value)}
        />
      </div>

      <div className="flex-center gap-4">
        <Button onClick={handleClose} variant="open" color="gray" full>
          Cancel
        </Button>
        <Button onClick={handleCreate} full disabled={!role.name}>
          Create
        </Button>
      </div>
    </StyledDialog>
  );
}
