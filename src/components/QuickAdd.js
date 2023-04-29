import IconButton from './buttons/IconButton';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import PropTypes from 'prop-types';

export default function QuickAdd({ onAdd }) {
  return (
    <div className="fixed md:right-8 right-5 bottom-20 md:bottom-10">
      <IconButton color="blue" onClick={onAdd}>
        <PlusIcon className="text-white h-7 w-7" />
      </IconButton>
    </div>
  );
}

QuickAdd.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
