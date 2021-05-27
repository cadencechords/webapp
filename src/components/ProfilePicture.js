import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";

export default function ProfilePicture({ url }) {
	if (url) {
		return <img src={url} alt="Profile" className="w-full h-auto max-h-full rounded-full" />;
	} else {
		return <UserCircleIcon className="w-full h-full text-gray-500" />;
	}
}
