import { useEffect } from 'react';

import MemberRolesTable from '../tables/MemberRolesTable';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import Roles from '../components/Roles';
import Alert from '../components/Alert';
import useRoles from '../hooks/api/useRoles';
import useTeamMembers from '../hooks/api/useTeamMembers';

export default function RolesIndexPage() {
  const {
    data: roles,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRoles();

  const {
    data: teamMembers,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
  } = useTeamMembers();

  useEffect(() => {
    document.title = 'Permissions';
  }, []);

  if (isLoadingRoles || isLoadingMembers) {
    return <PageLoading />;
  }

  if (isErrorRoles || isErrorMembers)
    return (
      <Alert color="red">
        There was an issue getting the roles on this team
      </Alert>
    );

  return (
    <>
      <PageTitle title="Permissions" />A role provides a group of users a
      defined set of abilities within the application. Each team has a default
      of at least two roles, admin and member.
      <Roles roles={roles} />
      <MemberRolesTable members={teamMembers} roles={roles} />
    </>
  );
}
