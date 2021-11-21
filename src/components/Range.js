export default function Range({ className, step, max, min, onChange, value }) {
	return (
		<input
			type="range"
			className={`w-full ${className}`}
			orient="vertical"
			step={step}
			max={max}
			min={min}
			onChange={(e) => onChange?.(parseInt(e.target.value))}
			value={value}
		/>
	);
}

Range.defaultProps = {
	className: "",
};
