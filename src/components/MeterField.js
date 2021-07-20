import { useState } from "react";
import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";
import MeterDialog from "./MeterDialog";

export default function MeterField({ meter, onChange }) {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<div className="flex flex-row items-center mb-1">
				<DetailTitle>Meter:</DetailTitle>
				<EditableData
					value={meter ? meter : ""}
					onClick={() => setShowDialog(true)}
					placeholder="ex: 4/4"
				/>
			</div>
			<MeterDialog
				open={showDialog}
				onCloseDialog={() => setShowDialog(false)}
				onMeterChange={onChange}
				meter={meter}
			/>
		</>
	);
}
