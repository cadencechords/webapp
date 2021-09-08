import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useState } from "react";

export default function MetronomePopover({ children }) {
	const [referenceElement, setReferenceElement] = useState();
	const [popperElement, setPopperElement] = useState();
	const { styles, attributes } = usePopper(referenceElement, popperElement);

	return (
		<Popover>
			<Popover.Button
				ref={setReferenceElement}
				className="fixed bottom-6 right-6 outline-none focus:outline-none"
			>
				Metronome
			</Popover.Button>
			<Popover.Panel
				ref={setPopperElement}
				style={styles.popper}
				{...attributes.popper}
				className="rounded-md shadow-2xl p-10 px-7 py-4 bg-white"
			>
				{children}
			</Popover.Panel>
		</Popover>
	);
}
