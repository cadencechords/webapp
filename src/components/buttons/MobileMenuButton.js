import { TEXT_COLORS } from "../Button";

export default function MobileMenuButton({ children, onClick, full, color, disabled, className }) {
	let classes =
		" font-semibold outline-none focus:outline-none  py-3 px-6 text-sm transition-colors whitespace-nowrap overflow-hidden overflow-ellipsis";
	let widthClasses = full ? " w-full " : "";
	let colorClasses = disabled
		? " text-gray-600 cursor-default "
		: ` ${TEXT_COLORS[color]} hover:bg-gray-100 focus:bg-gray-100 `;

	classes += widthClasses;
	classes += colorClasses;
	classes += ` ${className}`;
	return (
		<button onClick={onClick} className={classes} disabled={disabled}>
			{children}
		</button>
	);
}

MobileMenuButton.defaultProps = {
	color: "black",
	disabled: false,
};
