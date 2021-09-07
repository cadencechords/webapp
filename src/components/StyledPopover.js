import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { useState } from "react";

export default function StyledPopover({ children, button, position }) {
	let [referenceElement, setReferenceElement] = useState();
	let [popperElement, setPopperElement] = useState();
	const [arrowElement, setArrowElement] = useState(null);

	let { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: position,
		modifiers: [{ name: "arrow", options: { element: arrowElement } }],
	});

	return (
		<Popover>
			<Popover.Button className="w-full outline-none focus:outline-none" ref={setReferenceElement}>
				{button}
			</Popover.Button>
			<Popover.Panel
				className="bg-white rounded-md shadow-2xl"
				ref={setPopperElement}
				style={styles.popper}
				{...attributes.popper}
			>
				{children}
				<div ref={setArrowElement} style={styles.arrow}></div>
			</Popover.Panel>
		</Popover>
	);
}
