export default function DetailTitle({ children, className }) {
  return (
    <div
      className={`text-gray-600 dark:text-dark-gray-200 text-sm mr-3 ${className}`}
    >
      {children}
    </div>
  );
}
