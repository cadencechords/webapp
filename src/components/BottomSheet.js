import Button from "./Button";
import XIcon from "@heroicons/react/outline/XIcon";

export default function BottomSheet({ open, onClose, children, className }) {
	return (
		<div
			className={
				`fixed w-full transition-all ease-in-out duration-200 ` +
				`${open ? "bottom-0" : "-bottom-full"}`
			}
		>
			<div
				className={`rounded-t-md bg-white w-full md:w-3/4 lg:w-1/2 max-w-lg mx-auto relative z-30 ${className}`}
				style={{ boxShadow: "0 0px 50px -5px rgba(0, 0, 0, .25)" }}
			>
				<Button
					variant="open"
					className="absolute top-2 right-2"
					size="xs"
					color="gray"
					onClick={onClose}
				>
					<XIcon className="w-5 h-5" />
				</Button>
				{children}
			</div>
		</div>
	);
}

BottomSheet.defaultProps = {
	className: "",
};
