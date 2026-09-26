import IconButton from './buttons/IconButton';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default function QuickAdd({ onAdd }) {
  return (
    <div className="fixed md:right-8 right-5 bottom-20 md:bottom-10">
      <IconButton color="blue" onClick={onAdd}>
        <Icon name="add" className="text-white h-7 w-7" />
      </IconButton>
    </div>
  );
}

QuickAdd.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
