import FilledButton from "./FilledButton";
import OpenButton from "./OpenButton";

export default function AddCancelActions({ onAdd, onCancel, loadingAdd, addDisabled, addText }) {
	return (
		<div className="flex md:justify-end justify-center">
			<OpenButton bold color="gray" className="mr-2 md:flex-grow-0 flex-grow" onClick={onCancel}>
				Cancel
			</OpenButton>
			<FilledButton
				bold
				className="ml-2 md:flex-grow-0 flex-grow"
				onClick={onAdd}
				loading={loadingAdd}
				disabled={addDisabled}
			>
				{addText}
			</FilledButton>
		</div>
	);
}

AddCancelActions.defaultProps = {
	addText: "Add",
};
