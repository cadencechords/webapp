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
				`rounded-md p-4 border-2 transition-colors ` +
				`${selected ? "border-blue-500" : "border-gray-300"} ${className}`
			}
			onClick={() => onClick(name)}
		>
			<div className="flex-between">
				<div>
					<div className="uppercase font-semibold text-gray-600 tracking-widest mb-2">{name}</div>
					<div className="font-semibold text-2xl mb-2">{pricing}</div>
					<span className="bg-green-100 text-green-700 font-semibold p-1 rounded-md text-sm">
						{trialMessage}
					</span>
				</div>
				<div className="flex-center">
					{selected ? (
						<span className="w-5 h-5 rounded-full border-blue-500 border-8"></span>
					) : (
						<span className="w-5 h-5 rounded-full border-2"></span>
					)}
				</div>
			</div>
		</div>
	);
}
