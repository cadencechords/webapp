export default function PillButton({ children, onClick, color }) {
	return (
		<button
			className={`rounded-full focus:outline-none outline-none transition-all py-3 px-6 bg-${color}-600 hover:bg-${color}-800 text-white`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
