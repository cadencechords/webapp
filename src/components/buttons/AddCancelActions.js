import Button from "../Button";

export default function AddCancelActions({ onAdd, onCancel, loadingAdd, addDisabled, addText }) {
	return (
		<div className="flex md:justify-end justify-center">
			<Button variant="open" color="gray" className="mr-2 flex-grow" onClick={onCancel}>
				Cancel
			</Button>
			<Button
				className="ml-2 md:flex-grow-0 flex-grow"
				onClick={onAdd}
				loading={loadingAdd}
				disabled={addDisabled}
			>
				{addText}
			</Button>
		</div>
	);
}

AddCancelActions.defaultProps = {
	addText: "Add",
};
