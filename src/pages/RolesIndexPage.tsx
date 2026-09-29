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
    <div className="max-w-3xl mx-auto font-plain">
      <PageTitle title="Permissions" />
      {/* PageTitle pads its text 8px: the rest lines up with it. */}
      <div className="flex flex-col gap-8 px-2 mb-24">
        <p className="text-body-medium text-on-surface-variant">
          A role gives a group of members a set of abilities in the app. Every
          team starts with at least two roles, admin and member.
        </p>
        <Roles roles={roles} />
        <MemberRolesTable members={teamMembers} roles={roles} />
      </div>
    </div>
  );
}
