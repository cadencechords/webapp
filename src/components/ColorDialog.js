import { useState } from "react";
import BinderColor from "./BinderColor";
import OpenButton from "./buttons/OpenButton";
import StyledDialog from "./StyledDialog";
import { COLORS } from "../utils/BinderUtils";

export default function ColorDialog({ open, onCloseDialog, binderColor, onChange }) {
	const [currentColor, setCurrentColor] = useState(binderColor);

	const handleUpdate = () => {
		onChange(currentColor);
		onCloseDialog();
	};

	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog} title="Choose a color for your binder">
			<div className="grid grid-cols-5 gap-6 mb-4">
				{COLORS.map((color, index) => (
					<BinderColor color={color} onClick={setCurrentColor} key={index} />
				))}
			</div>

			<div>Current color:</div>
			<BinderColor color={currentColor} block />

			<div className="mt-4">
				<OpenButton color="blue" full bold onClick={handleUpdate}>
					Confirm
				</OpenButton>
			</div>
		</StyledDialog>
	);
}
