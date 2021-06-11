import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function FullscreenDialog({ children, open, onCloseDialog }) {
	return (
		<Transition show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 max-h-screen"
				static
				open={open}
				onClose={onCloseDialog}
			>
				<div className="text-center max-h-screen overflow-auto">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className={`fixed`} />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle" aria-hidden="true">
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
						<div className={`bg-white h-screen min-h-screen sm:min-h-full w-full`}>{children}</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
