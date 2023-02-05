import classNames from 'classnames';
import Checkbox from './Checkbox';

export default function Permission({
  name,
  description,
  checkable,
  checked,
  onChange,
}) {
  function handleChange(checkedValue) {
    if (checkable) {
      onChange(checkedValue);
    }
  }

  return (
    <div
      className={classNames(
        'flex items-center gap-4 px-3 py-2 border-b sm:rounded-lg dark:border-dark-gray-700 last:border-0 sm:border-0',
        checkable && 'sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800'
      )}
    >
      <Checkbox checked={checked} onChange={handleChange} />
      <div
        onClick={() => handleChange(!checked)}
        className={`${checkable && 'cursor-pointer'} w-full`}
      >
        <div className="font-semibold">{name}</div>
        <div className="dark:text-dark-gray-200">{description}</div>
      </div>
    </div>
  );
}
