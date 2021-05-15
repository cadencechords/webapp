import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import PropTypes from "prop-types";
import OpenButton from "./buttons/OpenButton";
import XIcon from "@heroicons/react/outline/XIcon";

export default function StyledDialog({
	open,
	onCloseDialog,
	title,
	children,
	overlayOpacity,
	size,
	showClose,
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
				<div className="min-h-screen sm:px-4 text-center">
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
							className={`inline-block w-full h-screen sm:h-full sm:max-w-${size} sm:mt-8 overflow-hidden text-left align-middle transition-all transform bg-white sm:shadow-xl sm:rounded-xl `}
						>
							{showClose && (
								<span className="absolute top-4 right-4">
									<OpenButton onClick={onCloseDialog}>
										<XIcon className="h-4 w-4 text-gray-700" />
									</OpenButton>
								</span>
							)}
							<Dialog.Title as="h3" className=" border-b">
								<div className="text-lg leading-6 text-gray-900 font-semibold px-5 py-6">
									{title}
								</div>
							</Dialog.Title>
							<div className="my-2 px-5 py-6">{children}</div>
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
	overlayOpacity: 20,
	size: "md",
	showClose: true,
};
