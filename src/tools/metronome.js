import lowClick from "../clicks/low.wav";
import { reportError } from "../utils/error";

export default class Metronome {
	constructor(tempo = 120) {
		this.audioContext = null;
		this.notesInQueue = [];
		this.currentQuarterNote = 0;
		this.tempo = tempo;
		this.lookahead = 25;
		this.scheduleAheadTime = 0.1;
		this.nextNoteTime = 0.0;
		this.isRunning = false;
		this.intervalID = null;
		this.sound = "beep";

		let request = new XMLHttpRequest();
		request.open("GET", lowClick, true);

		request.responseType = "arraybuffer";

		request.onload = () => {
			this.buffer = request.response;
		};

		request.send();
	}

	nextNote() {
		var secondsPerBeat = 60.0 / this.tempo;
		this.nextNoteTime += secondsPerBeat;

		this.currentQuarterNote++;
		if (this.currentQuarterNote === 4) {
			this.currentQuarterNote = 0;
		}
	}

	async scheduleNote(beatNumber, timeToSchedule) {
		this.notesInQueue.push({ note: beatNumber, time: timeToSchedule });

		let soundNode = await this.getSound();
		soundNode.connect(this.audioContext.destination);
		soundNode.start(timeToSchedule);
		soundNode.stop(timeToSchedule + 0.03);
	}

	async getSound() {
		if (this.sound === "click") {
			try {
				let bufferClone = this.buffer.slice(0);
				let decodedData = await this.audioContext.decodeAudioData(bufferClone);

				const clickNode = this.audioContext.createBufferSource();
				clickNode.buffer = decodedData;
				return clickNode;
			} catch (error) {
				reportError(error);
			}
		} else {
			const beepNode = this.audioContext.createOscillator();
			beepNode.frequency.value = 800;
			return beepNode;
		}
	}

	scheduler() {
		while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
			this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
			this.nextNote();
		}
	}

	start() {
		if (this.isRunning) return;

		if (this.audioContext === null) {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}

		this.isRunning = true;

		this.currentQuarterNote = 0;
		this.nextNoteTime = this.audioContext.currentTime + 0.05;

		this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
	}

	stop() {
		this.isRunning = false;

		clearInterval(this.intervalID);
	}
}
