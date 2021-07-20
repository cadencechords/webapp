import Button from "./Button";
import EditableData from "./inputs/EditableData";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import PauseIcon from "@heroicons/react/outline/PauseIcon";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import MetronomeTool from "../tools/metronome";
import TapTempo from "./TapTempo";
import { useEffect, useState } from "react";
import MetronomePopover from "./MetronomePopover";
import MetronomeDialog from "./MetronomeDialog";

export default function Metronome({ bpm, onBpmChange }) {
	const [isOn, setIsOn] = useState(false);
	const [metronome] = useState(new MetronomeTool(bpm));
	const iconClasses = "w-10 h-10";

	const handleBpmEdited = (newBpm) => {
		if (newBpm !== "") {
			newBpm = Number.parseInt(newBpm);
		}
		onBpmChange(newBpm);
	};

	useEffect(() => {
		metronome?.changeBpm(bpm);
		if (isOn) {
			metronome?.stop();
			metronome?.start();
		}
	}, [bpm, metronome, isOn]);

	const handleToggleMetronome = () => {
		if (isOn) {
			metronome.stop();
			setIsOn(false);
		} else {
			metronome.start();
			setIsOn(true);
		}
	};

	const handlePauseMetronome = () => {
		metronome?.stop();
		setIsOn(false);
	};

	const content = (
		<>
			<div className="flex-center gap-3 w-1/2 mx-auto sm:w-36 mb-2">
				<Button
					variant="open"
					bold
					className="text-2xl"
					onClick={() => onBpmChange(bpm - 1)}
					color="purple"
				>
					<MinusIcon className="h-4 w-4" />
				</Button>
				<EditableData
					value={bpm}
					centered
					className="sm:text-xl text-xl"
					type="number"
					onChange={handleBpmEdited}
				/>
				<Button
					variant="open"
					bold
					className="text-2xl"
					onClick={() => onBpmChange(bpm + 1)}
					color="purple"
				>
					<PlusIcon className="h-4 w-4" />
				</Button>
			</div>
			<div className="flex-between">
				<button
					className="outline-none focus:outline-none text-purple-600 hover:text-purple-800 focus:text-purple-800 transition-colors "
					onClick={handleToggleMetronome}
				>
					{isOn ? <PauseIcon className={iconClasses} /> : <PlayIcon className={iconClasses} />}
				</button>
				<TapTempo onBpmChange={handleBpmEdited} onTap={handlePauseMetronome} />
			</div>
		</>
	);
	return (
		<>
			<div className="hidden sm:block">
				<MetronomePopover>{content}</MetronomePopover>
			</div>
			<div className="sm:hidden">
				<MetronomeDialog>{content}</MetronomeDialog>
			</div>
		</>
	);
}
