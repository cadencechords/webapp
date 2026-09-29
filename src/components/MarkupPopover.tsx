import StyledPopover from './StyledPopover';
import { MenuItem, MenuList } from './Menu';
import usePerformanceMode from '../hooks/usePerformanceMode';
import Icon from './Icon';
import { PRESENTER_ICON_BUTTON } from './PresenterTopAppBar';

type MarkupPopoverProps = {
  onAddNote: () => void;
  onShowMarkingsModal: () => void;
};

// The top app bar's markup action: a standard icon button opening a menu to
// add a sticky note or a marking, or to start annotating.
export default function MarkupPopover({
  onAddNote,
  onShowMarkingsModal,
}: MarkupPopoverProps) {
  const { beginAnnotating } = usePerformanceMode();

  return (
    <StyledPopover
      position="bottom-end"
      // The popover's own button, styled as an icon button: a Button inside
      // it would nest buttons.
      buttonClassName={PRESENTER_ICON_BUTTON}
      button={
        <>
          <Icon name="edit_note" className="w-6 h-6" />
          <span className="sr-only">Add markup</span>
        </>
      }
    >
      <MenuList className="w-60">
        <MenuItem onClick={onAddNote} icon={<Icon name="sticky_note_2" />}>
          Sticky note
        </MenuItem>
        <MenuItem
          onClick={onShowMarkingsModal}
          icon={
            // A dynamic marking's own face: an italic, bold f.
            <span
              aria-hidden="true"
              style={{ fontFamily: 'Times New Roman' }}
              className="w-6 text-2xl italic font-bold leading-none text-center"
            >
              f
            </span>
          }
        >
          Marking
        </MenuItem>
        <MenuItem onClick={beginAnnotating} icon={<Icon name="draw" />}>
          Annotate
        </MenuItem>
      </MenuList>
    </StyledPopover>
  );
}
