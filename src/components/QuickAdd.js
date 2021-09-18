import IconButton from "./buttons/IconButton";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import PropTypes from "prop-types";

export default function QuickAdd({ onAdd }) {
	return (
		<div className="fixed right-8 bottom-20 md:bottom-10">
			<IconButton color="blue" onClick={onAdd}>
				<PlusIcon className="h-7 w-7 text-white" />
			</IconButton>
		</div>
	);
}

QuickAdd.propTypes = {
	onAdd: PropTypes.func.isRequired,
};
