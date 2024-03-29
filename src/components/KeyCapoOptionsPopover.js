import Button from './Button';
import CheckIcon from '@heroicons/react/outline/CheckIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import StyledPopover from './StyledPopover';

export default function KeyCapoOptionsPopover({ song, onShowBottomSheet }) {
  if (!song) return null;

  const button = (
    <Button
      className="w-10 mr-2 h-9"
      style={{ borderRadius: '10px', padding: 0 }}
    >
      {song.capo?.capo_key ||
        (song.show_transposed && song.transposed_key) ||
        song.original_key}
    </Button>
  );

  const iconClasses = 'h-4 w-4 text-green-500 dark:text-dark-green ml-2';

  return (
    <StyledPopover button={button} position="bottom-end" className="w-48">
      <MobileMenuButton
        size="sm"
        full
        className="border-b rounded-t-md dark:border-dark-gray-400 flex-center"
        onClick={() => onShowBottomSheet('transpose')}
      >
        Transpose
        {song.show_transposed && song.transposed_key && (
          <CheckIcon className={iconClasses} />
        )}
      </MobileMenuButton>
      <MobileMenuButton
        size="sm"
        full
        className="rounded-b-md flex-center"
        onClick={() => onShowBottomSheet('capo')}
      >
        Capo
        {song.capo && <CheckIcon className={iconClasses} />}
      </MobileMenuButton>
    </StyledPopover>
  );
}
