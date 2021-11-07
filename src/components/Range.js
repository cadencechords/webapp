export default function Range({ className, step, max, min, onChange, value }) {
	return (
		<input
			type="range"
			className={`rotate-90 transform inline-block w-full ${className}`}
			orient="vertical"
			step={step}
			max={max}
			min={min}
			onChange={(e) => onChange(e.target.value)}
			value={value}
		/>
	);
}

Range.defaultProps = {
	className: "",
};
