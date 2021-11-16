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
			className="border-2 border-blue-500 rounded-md flex-center h-12 w-14 absolute right-2  focus:outline-none text-blue-600 font-medium"
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
