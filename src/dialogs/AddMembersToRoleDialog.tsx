import { useState } from 'react';

import Button from '../components/Button';
import DialogActions from '../components/DialogActions';
import Checkbox from '../components/Checkbox';
import StyledDialog from '../components/StyledDialog';
import { useParams } from 'react-router';
import useTeamMembers from '../hooks/api/useTeamMembers';
import useAddMembersToRole from '../hooks/api/useAddMembersToRole';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';
import ProfilePicture from '../components/ProfilePicture';
import classNames from 'classnames';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
  ON_LOWEST_STATE_LAYERS,
} from '../components/lists/listItem';
import { getNameOrEmail, hasName } from '../utils/model';
import { pluralize } from '../utils/StringUtils';
import type { Membership } from '../types';

type AddMembersToRoleDialogProps = {
  /** The role's memberships, undefined until the role loads. */
  membersInRole?: Membership[];
  open: boolean;
  onCloseDialog: () => void;
};

export default function AddMembersToRoleDialog({
  membersInRole,
  open,
  onCloseDialog,
}: AddMembersToRoleDialogProps) {
  const { data: teamMembers, isLoading, isError, isSuccess } = useTeamMembers();
  const [membersToAdd, setMembersToAdd] = useState<number[]>([]);
  const { run: addMembersToRole, isLoading: isSaving } = useAddMembersToRole({
    onSuccess: handleClose,
  });
  // The route's path declares :id.
  const id = useParams<{ id: string }>().id;

  // The team's members not already in the role, once they load.
  const membersInRoleIds = membersInRole?.map(member => member.id) || [];
  const available = isSuccess
    ? teamMembers.filter(
        teamMember => !membersInRoleIds.includes(teamMember.id)
      )
    : [];

  function handleMemberToggled(member: Membership, checked: boolean) {
    if (checked) {
      setMembersToAdd(currentMembers => [...currentMembers, member.id]);
    } else {
      setMembersToAdd(currentMemberIds =>
        currentMemberIds.filter(memberId => memberId !== member.id)
      );
    }
  }

  async function handleSaveAddedMembers() {
    addMembersToRole({ memberIds: membersToAdd, roleId: id });
  }

  function handleClose() {
    setMembersToAdd([]);
    onCloseDialog();
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleClose}
      title="Add members"
      fullscreen={false}
      size="lg"
      // Below the rows' surface-container-high in dark mode, like the Add
      // songs dialogs, so the rows stand out.
      surface="low-in-dark"
    >
      {/* Team members not yet in the role, as a segmented list of checkable
          rows (like adding songs to a set). */}
      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">
          There was an issue getting the members on this team
        </Alert>
      )}
      {isSuccess &&
        (available.length === 0 ? (
          <p className="px-4 py-3 text-body-medium text-on-surface-variant">
            Everyone on the team is already in this role
          </p>
        ) : (
          <div className="list-segmented max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
            {available.map(member => (
              // A label: a click anywhere on the row toggles its checkbox.
              <label
                key={member.id}
                className={classNames(
                  LIST_ITEM_TWO_LINE,
                  LIST_ITEM_INTERACTIVE,
                  ON_LOWEST_STATE_LAYERS,
                  // Lowest in light mode, higher than the panel in dark.
                  'bg-surface-container-lowest dark:bg-surface-container-high cursor-pointer'
                )}
              >
                <Checkbox
                  checked={membersToAdd.includes(member.id)}
                  onChange={checked => handleMemberToggled(member, checked)}
                />
                <ProfilePicture
                  url={member.user.image_url}
                  name={getNameOrEmail(member.user)}
                  size="md"
                />
                <span className="flex-1 min-w-0">
                  <span className="block truncate">
                    {hasName(member.user)
                      ? `${member.user.first_name} ${member.user.last_name}`
                      : member.user.email}
                  </span>
                  <span className={`block truncate ${LIST_SUPPORTING_TEXT}`}>
                    {hasName(member.user)
                      ? member.user.email
                      : `Currently ${member.role.name}`}
                  </span>
                </span>
                {hasName(member.user) && (
                  <span className="shrink-0 text-label-medium text-on-surface-variant">
                    {member.role.name}
                  </span>
                )}
              </label>
            ))}
          </div>
        ))}
      <DialogActions>
        <Button variant="open" color="gray" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="open"
          size="sm"
          loading={isSaving}
          disabled={membersToAdd.length === 0}
          onClick={handleSaveAddedMembers}
        >
          {membersToAdd.length === 0
            ? 'Add'
            : `Add ${membersToAdd.length} ${pluralize('member', membersToAdd.length)}`}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
