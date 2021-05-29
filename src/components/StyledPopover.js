import { Popover } from "@headlessui/react";
import { useState } from "react";
import { usePopper } from "react-popper";

export default function StyledPopover({ children, button, position, offsets }) {
	let [referenceElement, setReferenceElement] = useState();
	let [popperElement, setPopperElement] = useState();
	const [arrowElement, setArrowElement] = useState(null);

	const offsetModifier = {
		name: "offset",
		enabled: true,
		options: {
			offset: offsets,
		},
	};

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
				className="bg-white rounded-md shadow-xl"
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

StyledPopover.defaultProps = {
	position: "bottom",
	offsets: [0, 0],
};
