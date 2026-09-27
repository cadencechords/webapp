import Card from './Card';
import { Link } from 'react-router-dom';
import type { Role } from '../types';

type RoleCardProps = {
  role: Role;
};

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <Link to={`/permissions/${role.id}`}>
      <Card interactive className="text-center">
        <div className="text-title-medium">{role.name}</div>
        <div className="text-body-medium text-on-surface-variant">
          {role.memberships?.length} member
          {role.memberships?.length !== 1 && 's'}
        </div>
      </Card>
    </Link>
  );
}
