import Button from "./Button";
import MetronomeIcon from "../icons/MetronomeIcon";
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
				as="div"
				ref={setReferenceElement}
				className="fixed bottom-6 right-6 outline-none focus:outline-none"
			>
				<Button variant="open" color="gray">
					<MetronomeIcon className="w-5 h-5" />
				</Button>
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
