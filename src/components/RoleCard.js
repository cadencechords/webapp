import Card from "./Card";
import { Link } from "react-router-dom";

export default function RoleCard({ role, count }) {
  return (
    <Card className="dark:bg-dark-gray-800 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700  hover:bg-gray-200 focus:bg-gray-200 transition-colors cursor-pointer">
      <Link to={`/permissions/${role.id}`}>
        <div className="font-medium">{role.name}</div>
        <div className="text-sm">
          {count} member{count !== 1 && "s"}
        </div>
      </Link>
    </Card>
  );
}
