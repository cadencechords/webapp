export default function Badge({ children, className, color = 'blue' }) {
  return (
    <span
      className={`rounded-md px-1 py-0.5 text-sm ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}

const COLORS = {
  blue: 'bg-blue-100 text-blue-700',
  green:
    'bg-green-100 text-green-700 dark:bg-dark-green dark:text-dark-gray-100',
};
