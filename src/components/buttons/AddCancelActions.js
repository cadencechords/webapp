import Button from "../Button";

export default function AddCancelActions({ onAdd, onCancel, loadingAdd, addDisabled, addText }) {
	return (
		<div className="flex-center gap-3">
			<Button className="flex-grow w-1/2" variant="open" color="gray" onClick={onCancel}>
				Cancel
			</Button>
			<Button
				className="flex-grow w-1/2"
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
