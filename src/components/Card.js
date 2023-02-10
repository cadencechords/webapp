export default function Card({ children, className, onClick }) {
  return (
    <div
      className={`rounded-md bg-gray-50 py-3 px-5 relative ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

Card.defaultProps = {
  className: '',
};
