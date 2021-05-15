export default function Label({ children, className }) {
	return <div className={"mb-2 font-semibold text-sm text-gray-700 " + className}>{children}</div>;
}
