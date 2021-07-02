import { useHistory } from "react-router-dom";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import Button from "./Button";

export default function EditorMobileTopNav({ song, onShowEditorDrawer }) {
	const router = useHistory();

	const handleGoBack = () => {
		router.push(`/songs/${song.id}`);
	};

	if (song) {
		return (
			<nav className="py-2 px-1 border-b bg-gray-50">
				<div className="flex-between max-w-3xl mx-auto">
					<Button variant="open" color="gray" onClick={handleGoBack}>
						<ArrowNarrowLeftIcon className="h-6 w-6" />
					</Button>
					<h1 className="font-semibold w-1/3 text-center overflow-ellipsis whitespace-nowrap overflow-hidden">
						{song.name}
					</h1>
					<Button variant="open" color="gray" onClick={onShowEditorDrawer}>
						<PencilIcon className="h-5 w-5" />
					</Button>
				</div>
			</nav>
		);
	} else {
		return <nav className="py-2 px-1 border-b bg-gray-50"></nav>;
	}
}
