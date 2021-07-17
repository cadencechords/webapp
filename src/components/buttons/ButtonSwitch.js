export default function ButtonSwitch({ activeButtonLabel, buttonLabels, onClick }) {
	return (
		<div className="p-1 bg-gray-100 flex rounded-md border border-gray-100 flex-shrink-0">
			{buttonLabels.map((label, index) => (
				<ButtonSwitchOption
					key={index}
					active={label === activeButtonLabel}
					onClick={() => onClick(label)}
				>
					{label}
				</ButtonSwitchOption>
			))}
		</div>
	);
}

export function ButtonSwitchOption({ children, active, onClick }) {
	let baseButtonClasses =
		"outline-none focus:outline-none flex-1 transition-colors text-xs text-gray-600 font-semibold ";
	if (active) {
		return (
			<button className={"bg-white py-1 flex-1 rounded-sm shadow-sm " + baseButtonClasses}>
				{children}
			</button>
		);
	} else {
		return (
			<button className={"flex-1 " + baseButtonClasses} onClick={onClick}>
				{children}
			</button>
		);
	}
}
