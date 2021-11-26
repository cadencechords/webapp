import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "./Button";

export default function EditorMobileTopNav({ song, onShowEditorDrawer, onGoBack }) {
	if (song) {
		return (
			<nav className="py-2 px-1 border-b dark:border-dark-gray-600 bg-gray-50 dark:bg-dark-gray-800">
				<div className="flex-between max-w-3xl mx-auto">
					<Button variant="open" color="gray" onClick={onGoBack}>
						<ArrowNarrowLeftIcon className="h-6 w-6" />
					</Button>
					<h1 className="font-semibold w-1/3 text-center overflow-ellipsis whitespace-nowrap overflow-hidden">
						{song.name}
					</h1>
					<Button variant="open" color="gray" onClick={onShowEditorDrawer}>
						<AdjustmentsIcon className="h-5 w-5" />
					</Button>
				</div>
			</nav>
		);
	} else {
		return <nav className="py-2 px-1 border-b bg-gray-50"></nav>;
	}
}
