import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import PropTypes from "prop-types";

export default function StyledDialog({
	open,
	onCloseDialog,
	title,
	children,
	overlayOpacity,
	size,
}) {
	return (
		<Transition show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				static
				open={open}
				onClose={onCloseDialog}
			>
				<div className="min-h-screen px-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className={`fixed inset-0 bg-black bg-opacity-${overlayOpacity}`} />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block h-screen align-middle" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div
							className={`inline-block w-full max-w-${size} p-6 mt-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl`}
						>
							<Dialog.Title as="h3" className="text-lg  leading-6 text-gray-900 font-semibold">
								{title}
							</Dialog.Title>
							<div className="my-2">{children}</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}

StyledDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
};

StyledDialog.defaultProps = {
	overlayOpacity: 50,
	size: "md",
};
