import Icon from './Icon';

export default function CapoOption({
  className,
  selected,
  capoNumber,
  capoKey,
  onClick,
}) {
  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={() => onClick?.(capoKey)}
        className={
          `focus:outline-hidden outline-hidden bg-gray-100 dark:bg-dark-gray-600 transition-all ` +
          ` font-semibold text-lg h-12 w-12 rounded-md block mb-2 flex-center` +
          ` ${selected ? 'bg-blue-600 dark:bg-dark-blue text-white' : ''}`
        }
      >
        {capoKey === 'None' ? (
          <Icon
            name="cancel"
            className={`w-6 h-6 ${selected ? 'text-white' : 'text-gray-600'}`}
          />
        ) : (
          capoKey
        )}
      </button>
      <span className="text-sm">{capoNumber}</span>
    </div>
  );
}
