export default function IconButton({ children, color }) {
	return (
		<button
			className={`focus:outline-none border-0 rounded-full bg-${color}-700  hover:bg-${color}-800 transition-all p-2`}
		>
			{children}
		</button>
	);
}
