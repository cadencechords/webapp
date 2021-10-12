import { Listbox } from "@headlessui/react";
import SelectorIcon from "@heroicons/react/solid/SelectorIcon";

export default function StyledListBox({ options, onChange, selectedOption, background, relative }) {
	return (
		<Listbox value={selectedOption.value} onChange={onChange}>
			<div className="relative">
				<Listbox.Button
					className={
						`transition-all px-3 py-2 shadow-sm h-8 text-left border-gray-300 focus:outline-none outline-none` +
						` w-full border rounded-md focus:ring-inset focus:ring-2 focus:ring-blue-400 flex-between` +
						` ${background === "white" ? "bg-white" : " bg-" + background + "-200"}`
					}
				>
					{selectedOption.template}
					<SelectorIcon className="w-4 h-4 text-gray-500" />
				</Listbox.Button>
				<Listbox.Options
					className={
						`overflow-auto bg-white shadow-xl w-full rounded-md mt-1 py-2 ` +
						`${relative ? "" : "absolute"} z-50 max-h-40`
					}
				>
					{options?.map((option, index) => (
						<Listbox.Option
							key={index}
							value={option.value}
							className={({ active, selected }) =>
								`${
									active || selected ? "bg-gray-100 " : ""
								} px-3 py-1 hover:bg-gray-100 flex items-center`
							}
						>
							{option.template}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</div>
		</Listbox>
	);
}

StyledListBox.defaultProps = { background: "transparent" };
