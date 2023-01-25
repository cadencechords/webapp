import IconButton from './buttons/IconButton';
import PlusIcon from '@heroicons/react/outline/PlusCircleIcon';

export default function MobileHeader({ title, className, onAdd, canAdd }) {
  return (
    <div
      className={`bg-white dark:bg-dark-gray-800 z-30 py-3 px-1 border-b dark:border-0 fixed left-0 top-0 right-0 ${className} font-semibold text-center`}
    >
      {title}

      {canAdd && (
        <IconButton
          color="white"
          className="absolute right-3 top-2.5 p-1.5"
          onClick={onAdd}
        >
          <PlusIcon className="w-5 h-5 text-blue-600 dark:text-dark-blue" />
        </IconButton>
      )}
    </div>
  );
}

MobileHeader.defaultProps = {
  canAdd: true,
};
