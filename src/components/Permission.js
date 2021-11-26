import Checkbox from "./Checkbox";

export default function Permission({ name, description, checkable, checked, onChange }) {
	function handleChange(checkedValue) {
		if (checkable) {
			onChange(checkedValue);
		}
	}

	return (
		<div className="border-b dark:border-dark-gray-700 py-2 last:border-0 flex items-center gap-4">
			<Checkbox checked={checked} onChange={handleChange} />
			<div
				onClick={() => handleChange(!checked)}
				className={`${checkable && "cursor-pointer"} w-full`}
			>
				<div className="font-semibold">{name}</div>
				<div className="dark:text-dark-gray-200">{description}</div>
			</div>
		</div>
	);
}
