import Button from './Button';
import OutlinedInput from './inputs/OutlinedInput';
import { reportError } from '../utils/error';
import { updateCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import usersApi, { type UserUpdates } from '../api/UserApi';
import type { User } from '../types';

type AccountProfileBasicInfoProps = {
  user: User;
};

/** The fields this form edits. */
type ProfileUpdates = Pick<UserUpdates, 'first_name' | 'last_name'>;

export default function AccountProfileBasicInfo({
  user,
}: AccountProfileBasicInfoProps) {
  const [updates, setUpdates] = useState<ProfileUpdates>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleChange(field: keyof ProfileUpdates, value: string) {
    setUpdates(currentUpdates => ({ ...currentUpdates, [field]: value }));
  }

  function hasUpdates() {
    return Object.keys(updates).length > 0;
  }

  async function handleSave() {
    try {
      setLoading(true);
      const { data } = await usersApi.updateCurrentUser(updates);
      dispatch(updateCurrentUser(data));
      setUpdates({});
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  }

  // A card of outlined fields, two across from md, with Save at its end.
  return (
    <section className="flex flex-col gap-4 p-6 rounded-extra-large-increased bg-surface-container-low text-on-surface">
      <h2 className="text-title-large">Personal info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <OutlinedInput
          label="First name"
          placeholder="Enter your first name"
          value={
            updates.first_name !== undefined
              ? updates.first_name
              : user.first_name
          }
          onChange={newFirstName => handleChange('first_name', newFirstName)}
        />
        <OutlinedInput
          label="Last name"
          placeholder="Enter your last name"
          value={
            updates.last_name !== undefined ? updates.last_name : user.last_name
          }
          onChange={newLastName => handleChange('last_name', newLastName)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          disabled={!hasUpdates()}
          size="md"
          className="w-full sm:w-auto"
          loading={loading}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </section>
  );
}
