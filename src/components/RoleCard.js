import Card from "./Card";
import { Link } from "react-router-dom";

export default function RoleCard({ role }) {
	return (
		<Card className="hover:bg-gray-200 focus:bg-gray-200 transition-colors cursor-pointer">
			<Link to={`/permissions/${role.id}`}>
				<div className="font-medium">{role.name}</div>
				<div className="text-sm">
					{role.memberships?.length} member{role.memberships?.length !== 1 && "s"}
				</div>
			</Link>
		</Card>
	);
}
