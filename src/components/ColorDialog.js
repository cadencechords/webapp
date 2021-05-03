import { useState } from "react";
import BinderColor from "./BinderColor";
import StyledDialog from "./StyledDialog";

export default function ColorDialog({ open, onCloseDialog, binderColor }) {
	const [currentColor, setCurrentColor] = useState(binderColor);

	return (
		<StyledDialog
			open={open}
			onCloseDialog={onCloseDialog}
			title="Choose a color for your binder"
		>
			<div className="grid grid-cols-5 gap-6 mb-4">
				<BinderColor
					color="yellow"
					onClick={(color) => setCurrentColor(color)}
				/>
				<BinderColor color="red" onClick={(color) => setCurrentColor(color)} />
				<BinderColor color="pink" onClick={(color) => setCurrentColor(color)} />
				<BinderColor
					color="green"
					onClick={(color) => setCurrentColor(color)}
				/>
				<BinderColor color="blue" onClick={(color) => setCurrentColor(color)} />
				<BinderColor
					color="indigo"
					onClick={(color) => setCurrentColor(color)}
				/>
				<BinderColor
					color="purple"
					onClick={(color) => setCurrentColor(color)}
				/>
			</div>

			<div>Current color:</div>
			<BinderColor color={currentColor} block />
		</StyledDialog>
	);
}
