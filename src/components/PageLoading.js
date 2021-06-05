import PulseLoader from "react-spinners/PulseLoader";

export default function PageLoading({ children }) {
	return (
		<div className="text-center py-4">
			{children && <div className="mb-4">{children}</div>}
			<PulseLoader color="blue" />
		</div>
	);
}
