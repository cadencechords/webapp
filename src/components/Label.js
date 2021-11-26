export default function Label({ children, className }) {
	return (
		<div
			className={"mb-2 font-semibold text-sm text-gray-700 dark:text-dark-gray-200 " + className}
		>
			{children}
		</div>
	);
}
