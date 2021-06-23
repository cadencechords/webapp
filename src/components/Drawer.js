export default function Drawer({ open, onClose, children }) {
	return (
		<>
			<div
				className={`bg-black h-full fixed top-0 left-0 right-0 bottom-0 transition-all
                    ${open ? "visible bg-opacity-70" : "hidden bg-opacity-0"}
                `}
				onClick={onClose}
			></div>
			<aside
				className={`fixed top-0 bottom-0 right-0 h-full bg-white ${
					open ? "w-52" : "w-0"
				} transition-all`}
			>
				{children}
			</aside>
		</>
	);
}
