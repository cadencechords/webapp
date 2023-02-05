import Card from './Card';
import { Link } from 'react-router-dom';

export default function RoleCard({ role }) {
  return (
    <Link to={`/permissions/${role.id}`}>
      <Card className="text-center transition-colors cursor-pointer dark:bg-dark-gray-800 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700 hover:bg-gray-200 focus:bg-gray-200">
        <div className="font-medium">{role.name}</div>
        <div className="text-sm">
          {role.memberships?.length} member
          {role.memberships?.length !== 1 && 's'}
        </div>
      </Card>
    </Link>
  );
}
