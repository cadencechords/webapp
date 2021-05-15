import FilledButton from "./FilledButton";
import OpenButton from "./OpenButton";

export default function AddCancelActions({ onAdd, onCancel, loadingAdd }) {
	return (
		<div className="flex md:justify-end justify-center">
			<OpenButton color="gray" className="mr-2 md:flex-grow-0 flex-grow" onClick={onCancel}>
				Cancel
			</OpenButton>
			<FilledButton
				bold
				className="ml-2 md:flex-grow-0 flex-grow"
				onClick={onAdd}
				loading={loadingAdd}
				disabled={loadingAdd}
			>
				Add
			</FilledButton>
		</div>
	);
}
