import Button from "./Button";
import OutlinedInput from "./inputs/OutlinedInput";
import { useState } from "react";
import MembershipsApi from "../api/membershipsApi";

export default function AccountProfileBasicInfo({ user, onUpdated }) {
  const [updates, setUpdates] = useState({});

  function handleChange(field, value) {
    setUpdates((currentUpdates) => ({ ...currentUpdates, [field]: value }));
  }

  function hasUpdates() {
    return Object.keys(updates).length > 0;
  }

  function handleSave() {
    MembershipsApi.updateMyMember(updates);
    onUpdated(updates);
    setUpdates({});
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
        <div>
          <OutlinedInput
            label="First name"
            placeholder="Enter your first name"
            value={
              updates.first_name !== undefined
                ? updates.first_name
                : user.first_name
            }
            onChange={(newFirstName) =>
              handleChange("first_name", newFirstName)
            }
          />
        </div>
        <div>
          <OutlinedInput
            label="Last name"
            placeholder="Enter your last name"
            value={
              updates.last_name !== undefined
                ? updates.last_name
                : user.last_name
            }
            onChange={(newLastName) => handleChange("last_name", newLastName)}
          />
        </div>
        <div>
          <OutlinedInput
            label="Phone number"
            placeholder="Enter your phone number"
            value={
              updates.phone_number !== undefined
                ? updates.phone_number
                : user.phone_number
            }
            onChange={(newPhoneNumber) =>
              handleChange("phone_number", newPhoneNumber)
            }
            type="tel"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={!hasUpdates()} full onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
