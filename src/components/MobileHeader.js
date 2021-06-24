import IconButton from "./buttons/IconButton";
import PlusIcon from "@heroicons/react/outline/PlusIcon";

export default function MobileHeader({ title, className, onAdd }) {
	return (
		<div
			className={`bg-white py-3 px-1 border-b fixed left-0 top-0 right-0 ${className} font-semibold text-center`}
		>
			{title}

			<IconButton color="blue" className="absolute right-3 top-2.5 p-1.5" onClick={onAdd}>
				<PlusIcon className="h-5 w-5 text-white" />
			</IconButton>
		</div>
	);
}
