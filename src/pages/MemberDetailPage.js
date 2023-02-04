import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import Button from '../components/Button';
import MemberMenu from '../components/mobile menus/MemberMenu';
import PageLoading from '../components/PageLoading';
import ProfilePicture from '../components/ProfilePicture';
import UserApi from '../api/UserApi';
import { reportError } from '../utils/error';
import { toMonthYearDate } from '../utils/DateUtils';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import usePermissionsCheck from '../hooks/usePermissionsCheck';
import { REMOVE_MEMBERS } from '../utils/constants';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState();
  const [loadingMember, setLoadingMember] = useState(true);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [alert, setAlert] = useState();
  const router = useHistory();

  const { can } = usePermissionsCheck();

  useEffect(() => {
    async function fetchTeamMember() {
      try {
        let { data } = await UserApi.getMember(id);
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
    return `${member.first_name} ${member.last_name}`;
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
  } else {
    return (
      <>
        <div className="max-w-sm mx-auto mt-4">
          {alert && (
            <div className="mb-4">
              <Alert color="yellow">{alert}</Alert>
            </div>
          )}
          <div className="mb-1 text-2xl font-bold text-center">
            {hasName() ? getFullName() : member.email}
          </div>
          <div className="mb-4 text-lg text-center text-gray-600 dark:text-dark-gray-200">
            {hasName() ? member.email : 'No name provided yet'}
          </div>
          <div className="mb-2 flex-center">
            <ProfilePicture url={member.image_url} />
          </div>

          <div className="mb-4 text-sm">
            <div className="pb-2 text-gray-600 border-b dark:text-dark-gray-200 flex-between dark:border-dark-gray-600">
              <div className="font-semibold">Position:</div>
              {member?.position ? member.position : 'No position provided yet'}
            </div>
            <div className="py-2 text-gray-600 dark:text-dark-gray-200 flex-between">
              <div className="font-semibold">Joined:</div>
              {toMonthYearDate(member.created_at)}
            </div>
          </div>
          {can(REMOVE_MEMBERS) && (
            <Button
              full
              variant="accent"
              onClick={() => setMemberMenuOpen(true)}
            >
              Actions
            </Button>
          )}
          <MemberMenu
            open={memberMenuOpen}
            onCloseDialog={() => setMemberMenuOpen(false)}
            member={member}
            onRemoved={handleMemberRemoved}
          />
        </div>
      </>
    );
  }
}
