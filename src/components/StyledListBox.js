import { Listbox } from "@headlessui/react";
import SelectorIcon from "@heroicons/react/solid/SelectorIcon";

export default function StyledListBox({ options, onChange, selectedOption }) {
	return (
		<Listbox value={selectedOption.value} onChange={onChange}>
			<Listbox.Button
				className={
					`transition-all px-3 py-2 shadow-sm text-left border-gray-300 focus:outline-none outline-none` +
					` w-full border rounded-md focus:ring-inset focus:ring-2 focus:ring-blue-400 flex items-center justify-between`
				}
			>
				{selectedOption.template}
				<SelectorIcon className="w-4 h-4 text-gray-500" />
			</Listbox.Button>
			<Listbox.Options className="max-h-20 overflow-auto bg-white shadow-lg rounded-md mt-1 py-2">
				{options.map((option, index) => (
					<Listbox.Option
						key={index}
						value={option.value}
						className={({ active, selected }) =>
							`${
								active || selected ? "bg-gray-100 " : ""
							} pl-6 py-1 hover:bg-gray-100 flex items-center`
						}
					>
						{option.template}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
	);
}
