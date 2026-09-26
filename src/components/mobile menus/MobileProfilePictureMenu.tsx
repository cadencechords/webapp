import MobileMenuButton from '../buttons/MobileMenuButton';
import StyledDialog from '../StyledDialog';
import Icon from '../Icon';

type MobileProfilePictureMenuProps = {
  open: boolean;
  onCloseDialog: () => void;
  onOpenFileDialog: () => void;
  /** Called before the menu closes. */
  onDeleteImage: () => void;
};

export default function MobileProfilePictureMenu({
  open,
  onCloseDialog,
  onOpenFileDialog,
  onDeleteImage,
}: MobileProfilePictureMenuProps) {
  const handleDeleteImage = () => {
    onDeleteImage();
    onCloseDialog();
  };
  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title="Profile Picture"
      fullscreen={false}
    >
      <MobileMenuButton full onClick={onOpenFileDialog}>
        <div className="flex items-center">
          <Icon name="desktop_windows" className="mr-4 h-5" />
          Upload from device
        </div>
      </MobileMenuButton>
      <MobileMenuButton full color="red" onClick={handleDeleteImage}>
        <div className="flex items-center">
          <Icon name="delete" className="mr-4 h-5" />
          Remove photo
        </div>
      </MobileMenuButton>
    </StyledDialog>
  );
}
