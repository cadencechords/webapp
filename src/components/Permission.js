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
    <div className="flex items-center gap-4 px-3 py-2 border-b sm:rounded-lg sm:hover:bg-gray-100 dark:hover:bg-dark-gray-800 dark:border-dark-gray-700 last:border-0 sm:border-0">
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
