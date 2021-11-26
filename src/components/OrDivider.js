export default function OrDivider() {
	return (
		<div className="flex items-center font-semibold text-gray-400 dark:text-dark-gray-200 text-xs my-6">
			<hr className="flex-grow mr-3 dark:border-dark-gray-400" /> OR{" "}
			<hr className="ml-3 flex-grow dark:border-dark-gray-400" />
		</div>
	);
}
