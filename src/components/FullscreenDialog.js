import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function FullscreenDialog({ children, open, onCloseDialog }) {
	const checkIfEscapePressed = (e) => {
		console.log(e.keyCode);
	};
	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog
				onClose={onCloseDialog}
				open={open}
				className="fixed inset-0 z-10 overflow-y-auto"
				onKeyUp={checkIfEscapePressed}
			>
				<div className="min-h-screen text-center" onKeyUp={checkIfEscapePressed}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0" />
					</Transition.Child>
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
							className="inline-block w-full h-screen p-6 overflow-hidden text-left align-middle transition-all transform bg-white overflow-y-auto"
							onKeyUp={checkIfEscapePressed}
						>
							{children}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
