import { useState } from "react";
import BinderColor from "./BinderColor";
import StyledDialog from "./StyledDialog";
import { COLORS } from "../utils/BinderUtils";
import Button from "./Button";

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
				<Button variant="open" color="blue" full onClick={handleUpdate}>
					Confirm
				</Button>
			</div>
		</StyledDialog>
	);
}
