import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import Button from '../components/Button';
import MemberMenu from '../components/mobile menus/MemberMenu';
import PageLoading from '../components/PageLoading';
import ProfilePicture from '../components/ProfilePicture';
import Icon from '../components/Icon';
import DetailItem from '../components/lists/DetailItem';
import UserApi from '../api/UserApi';
import { reportError } from '../utils/error';
import { toMonthYearDate } from '../utils/DateUtils';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import usePermissionsCheck from '../hooks/usePermissionsCheck';
import { REMOVE_MEMBERS } from '../utils/constants';
import type { User } from '../types';
import { getNameOrEmail } from '../utils/model';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<User | undefined>(undefined);
  const [loadingMember, setLoadingMember] = useState(true);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [alert, setAlert] = useState<string | undefined>(undefined);
  const router = useHistory();

  const { can } = usePermissionsCheck();

  useEffect(() => {
    async function fetchTeamMember() {
      try {
        const { data } = await UserApi.getMember(id);
        setMember(data);
      } catch (error) {
        reportError(error);
      } finally {
        setLoadingMember(false);
      }
    }

    fetchTeamMember();
  }, [id]);

  const hasName = () => {
    return member?.first_name && member?.last_name;
  };

  const getFullName = () => {
    // Non-null: called only once the member has loaded.
    return `${member!.first_name} ${member!.last_name}`;
  };

  const handleMemberRemoved = () => {
    setMemberMenuOpen(false);
    setAlert(
      'You have just removed this member. You will be redirected to the members page shortly.'
    );
    setTimeout(() => {
      router.push('/members');
    }, 4000);
  };

  if (loadingMember) {
    return <PageLoading>Loading profile</PageLoading>;
  } else if (!member) {
    return (
      <div className="max-w-md mx-auto mt-4">
        <Alert color="red">We were unable to load this member.</Alert>
      </div>
    );
  } else {
    // An M3E profile: the member on a card (a large avatar, their name and
    // email), their details as a segmented list, and the member actions.
    return (
      <div className="max-w-md mx-auto mt-4 flex flex-col gap-4 font-plain">
        {alert && <Alert color="yellow">{alert}</Alert>}
        <section className="flex flex-col items-center gap-1 px-6 pt-8 pb-6 text-center rounded-extra-large-increased bg-surface-container-low text-on-surface">
          <div className="mb-3">
            <ProfilePicture
              url={member.image_url}
              name={getNameOrEmail(member)}
              size="xl"
            />
          </div>
          <h1 className="max-w-full truncate text-headline-small-emphasized">
            {hasName() ? getFullName() : member.email}
          </h1>
          <p className="max-w-full truncate text-body-large text-on-surface-variant">
            {hasName() ? member.email : 'No name provided yet'}
          </p>
        </section>

        <div className="list-segmented">
          <DetailItem icon="work" label="Position">
            {member.position || 'No position provided yet'}
          </DetailItem>
          <DetailItem icon="calendar_month" label="Joined">
            {/* Non-null: the API sends when the member joined. */}
            {toMonthYearDate(member.created_at!)}
          </DetailItem>
        </div>

        {can(REMOVE_MEMBERS) && (
          <Button
            full
            variant="accent"
            color="gray"
            size="md"
            className="flex-center gap-2"
            onClick={() => setMemberMenuOpen(true)}
          >
            <Icon name="manage_accounts" className="w-6 h-6" />
            Manage member
          </Button>
        )}
        <MemberMenu
          open={memberMenuOpen}
          onCloseDialog={() => setMemberMenuOpen(false)}
          member={member}
          onRemoved={handleMemberRemoved}
        />
      </div>
    );
  }
}
