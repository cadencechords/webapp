import IconButton from "./IconButton";
import PlusIcon from "@heroicons/react/outline/PlusIcon";

export default function QuickAdd() {
	return (
		<div className="fixed right-5 bottom-5">
			<IconButton color="purple">
				<PlusIcon className="h-6 y-6 text-white" />
			</IconButton>
		</div>
	);
}
