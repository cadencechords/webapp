import CheckIcon from '@heroicons/react/solid/CheckIcon';
import PropTypes from 'prop-types';

export default function Checkbox({ color, checked, onChange, className, id }) {
  return (
    <>
      <input
        type="checkbox"
        className="hidden"
        readOnly
        checked={checked}
        onChange={() => onChange(!checked)}
        id={id}
      />
      <button
        className={`w-5 h-5 ${RING_COLORS[color]}
				shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 outline-none rounded-md cursor-pointer flex-center
				${
          checked
            ? BACKGROUND_COLORS[color]
            : ' border border-gray-300 dark:border-dark-gray-400 '
        } ${className}`}
        onClick={() => onChange(!checked)}
      >
        {checked && <CheckIcon className="w-4 h-4 font-semibold text-white" />}
      </button>
    </>
  );
}

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

Checkbox.defaultProps = {
  color: 'blue',
  className: '',
};

const RING_COLORS = {
  red: 'ring-red-300',
  blue: 'ring-blue-400 dark:focus:ring-offset-dark-gray-700',
  yellow: 'ring-yellow-300',
  green: 'ring-green-300',
  purple: 'ring-purple-300',
  indigo: 'ring-indigo-300',
  pink: 'ring-pink-300',
  gray: 'ring-gray-300',
  black: 'ring-black',
  white: 'bg-white',
};

const BACKGROUND_COLORS = {
  red: 'bg-red-600',
  blue: 'bg-blue-600 dark:bg-dark-blue',
  yellow: 'bg-yellow-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  indigo: 'bg-indigo-600',
  pink: 'bg-pink-600',
  gray: 'bg-gray-600',
  black: 'bg-black',
  white: 'bg-white',
};
