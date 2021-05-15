import Checkbox from "./Checkbox";

export default function ThemeOption({ theme, onToggle, selected }) {
	let selectedClasses = " ring-inset ring-2 ring-blue-400 ";

	const handleCheck = (checkValue) => {
		onToggle(checkValue, theme);
	};

	return (
		<div
			className={`rounded-md cursor-pointer flex items-center w-full text-left focus:outline-none outline-none py-2 px-3 ${
				selected ? selectedClasses : ""
			}`}
			onClick={() => handleCheck(!selected)}
		>
			<Checkbox onChange={handleCheck} checked={selected} />{" "}
			<span className="ml-4 flex items-center">{theme.name}</span>
		</div>
	);
}
