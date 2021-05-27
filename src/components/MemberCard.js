import ProfilePicture from "./ProfilePicture";

export default function MemberCard({ member }) {
	if (member) {
		let adminStatusBubble;
		if (member.admin) {
			adminStatusBubble = (
				<span className="rounded-full px-3 py-0.5 bg-blue-600 text-white text-xs mb-1 inline-block">
					Admin
				</span>
			);
		}
		return (
			<div className="rounded-md bg-gray-100 p-3 text-center">
				<div className="m-auto w-20 h-20">
					<ProfilePicture url={member.image_url} />
				</div>
				{adminStatusBubble}
				<div className="font-semibold">
					{member.first_name} {member.last_name}
				</div>
				<div className="font-semibold text-sm text-gray-500">{member.position}</div>
			</div>
		);
	} else {
		return "";
	}
}
