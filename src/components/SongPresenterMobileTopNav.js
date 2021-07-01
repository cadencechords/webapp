import { useHistory } from "react-router-dom";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import Button from "./Button";
import { useParams } from "react-router-dom";

export default function SongPresenterMobileTopNav({ song, onShowOptionsDrawer }) {
	const router = useHistory();
	const { id } = useParams();

	const handleGoBack = () => {
		router.push(`/app/songs/${id}`);
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
					<Button variant="open" onClick={onShowOptionsDrawer} color="gray">
						<AdjustmentsIcon className="h-6 w-6" />
					</Button>
				</div>
			</nav>
		);
	} else {
		return <nav className="py-2 px-1 border-b bg-gray-50 flex-between"></nav>;
	}
}
