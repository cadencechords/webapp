import OpenInput from "./inputs/OpenInput";
import StyledDialog from "./StyledDialog";

export default function SearchDialog({ open, onCloseDialog }) {
	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog} borderedTop={false}>
			<div className="border-b pb-4">
				<OpenInput placeholder="Search for binders, lyrics or sets" />
			</div>
		</StyledDialog>
	);
}
