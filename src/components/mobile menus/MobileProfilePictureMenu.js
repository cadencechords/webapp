import MobileMenuButton from "../buttons/MobileMenuButton";
import StyledDialog from "../StyledDialog";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import DesktopComputerIcon from "@heroicons/react/outline/DesktopComputerIcon";

export default function MobileProfilePictureMenu({ open, onCloseDialog, onOpenFileDialog }) {
	return (
		<StyledDialog
			onCloseDialog={onCloseDialog}
			open={open}
			title="Profile Picture"
			fullscreen={false}
		>
			<MobileMenuButton full onClick={onOpenFileDialog}>
				<div className="flex items-center">
					<DesktopComputerIcon className="mr-4 h-5" />
					Upload from device
				</div>
			</MobileMenuButton>
			<MobileMenuButton full color="red">
				<div className="flex items-center">
					<TrashIcon className="mr-4 h-5" />
					Remove photo
				</div>
			</MobileMenuButton>
		</StyledDialog>
	);
}
