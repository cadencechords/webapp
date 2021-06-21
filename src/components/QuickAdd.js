import IconButton from "./buttons/IconButton";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import PropTypes from "prop-types";

export default function QuickAdd({ onAdd }) {
	return (
		<div className="fixed right-2 bottom-14 md:bottom-5">
			<IconButton color="blue" onClick={onAdd}>
				<PlusIcon className="h-6 y-6 text-white" />
			</IconButton>
		</div>
	);
}

QuickAdd.propTypes = {
	onAdd: PropTypes.func.isRequired,
};
