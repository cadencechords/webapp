export default function Drawer({ open, onClose, children }) {
	return (
		<>
			<div
				className={`z-30 bg-black h-full fixed top-0 left-0 right-0 bottom-0 transition-all
                    ${open ? "visible bg-opacity-70" : "hidden bg-opacity-0"}
                `}
				onClick={onClose}
			></div>
			<aside
				className={`z-30 fixed top-0 bottom-0 right-0 h-full w-52 bg-white transform ${
					open ? "translate-x-0" : "translate-x-52"
				} transition-all`}
			>
				{children}
			</aside>
		</>
	);
}
