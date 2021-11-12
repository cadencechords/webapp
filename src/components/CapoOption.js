import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

export default function CapoOption({ className, selected, capoNumber, capoKey, onClick }) {
	return (
		<div className={`text-center ${className}`}>
			<button
				onClick={() => onClick?.(capoKey)}
				className={
					`focus:outline-none outline-none bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 transition-all ` +
					` font-semibold text-lg h-12 w-12 rounded-md block mb-2 flex-center` +
					` ${selected ? "ring-blue-300 ring-4" : ""}`
				}
			>
				{capoKey === "None" ? <XCircleIcon className="w-6 h-6 text-gray-600" /> : capoKey}
			</button>
			<span className="text-sm">{capoNumber}</span>
		</div>
	);
}
