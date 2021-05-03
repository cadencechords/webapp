import { useState } from "react";
import BinderColor from "./BinderColor";
import BinderSongsList from "./BinderSongsList";
import ColorDialog from "./ColorDialog";
import PageTitle from "./PageTitle";

export default function BinderDetail() {
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
	const [binder] = useState({ color: "red" });
	const [binderName, setBinderName] = useState("Hymns");

	return (
		<div>
			<div className="flex items-center">
				<span className="mr-2">
					<BinderColor
						color={binder.color}
						onClick={() => setIsColorPickerOpen(true)}
					/>
					<ColorDialog
						open={isColorPickerOpen}
						onCloseDialog={() => setIsColorPickerOpen(false)}
						binderColor={binder.color}
					/>
				</span>
				<PageTitle
					title={binderName}
					editable
					onChange={(editedName) => setBinderName(editedName)}
				/>
			</div>
			<BinderSongsList />
		</div>
	);
}
