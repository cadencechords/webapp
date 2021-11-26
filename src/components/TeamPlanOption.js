export default function TeamPlanOption({
	selected,
	onClick,
	name,
	className,
	trialMessage,
	pricing,
}) {
	return (
		<div
			className={
				`rounded-md p-4 border-2 transition-colors dark:bg-dark-gray-800 ` +
				`${
					selected
						? "border-blue-500 dark:border-dark-blue"
						: "border-gray-300 dark:border-dark-gray-400 "
				} ${className}`
			}
			onClick={() => onClick(name)}
		>
			<div className="flex-between">
				<div>
					<div className="uppercase font-semibold text-gray-600 dark:text-dark-gray-200 tracking-widest mb-2">
						{name}
					</div>
					<div className="font-semibold text-2xl mb-2">{pricing}</div>
					<span className="bg-green-100 dark:bg-dark-green text-green-700 dark:text-dark-gray-100 font-medium p-1 rounded-md text-sm">
						{trialMessage}
					</span>
				</div>
				<div className="flex-center">
					{selected ? (
						<span className="w-5 h-5 rounded-full border-blue-500 dark:border-dark-blue border-8"></span>
					) : (
						<span className="w-5 h-5 rounded-full border-2"></span>
					)}
				</div>
			</div>
		</div>
	);
}
