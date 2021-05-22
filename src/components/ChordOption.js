import Checkbox from "./Checkbox";

export default function ChordOption({ optionName, children, on, onChange }) {
	if (children) {
	} else {
		return (
			<div className="text-sm my-3 flex items-center justify-between">
				{optionName}
				<Checkbox checked={on} onChange={() => onChange(!on)} />
			</div>
		);
	}
}
