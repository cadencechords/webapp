import { MenuItem, MenuList } from '../Menu';
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
      <MenuList className="-mx-3 *:rounded-medium">
        <MenuItem
          onClick={onOpenFileDialog}
          icon={<Icon name="desktop_windows" />}
        >
          Upload from device
        </MenuItem>
        <MenuItem
          destructive
          onClick={handleDeleteImage}
          icon={<Icon name="delete" />}
        >
          Remove photo
        </MenuItem>
      </MenuList>
    </StyledDialog>
  );
}
