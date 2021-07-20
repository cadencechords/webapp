import { useState } from "react";

export default function TapTempo({ onBpmChange, onTap }) {
	const [currentTapTime, setCurrentTapTime] = useState();

	const handleTap = () => {
		onTap();
		let previous = currentTapTime;

		let current = new Date().getTime();
		setCurrentTapTime(current);

		if (previous && current) {
			let newBpm = calculateBpm(previous, current);
			onBpmChange(newBpm);
		}
	};

	return (
		<button
			onClick={handleTap}
			className="border border-purple-300 rounded-md flex-center flex-grow-0 px-2 py-1 focus:outline-none outline-none font-bold text-gray-700"
		>
			Tap
		</button>
	);
}

function calculateBpm(previousTime, currentTime) {
	if (previousTime && currentTime) {
		let secondsPerBeat = (currentTime - previousTime) / 1000;
		let bpm = 60.0 / secondsPerBeat;
		return bpm;
	} else {
		return 0;
	}
}
