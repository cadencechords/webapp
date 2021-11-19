import lowClick from "../clicks/low.wav";

export default class Metronome {
	constructor(bpm = 120) {
		this.metronomeInterval = null;
		if (isNaN(bpm)) {
			this.bpm = 0;
		} else {
			this.bpm = bpm;
		}
		this.nextNoteTime = 0.0;
		this.DORMANT_DURATION = 25;
		this.SCHEDULE_AHEAD_TIME = 0.1;
		this.SECONDS_IN_MINUTE = 60.0;
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

		let request = new XMLHttpRequest();
		request.open("GET", lowClick, true);

		request.responseType = "arraybuffer";

		request.onload = () => {
			this.buffer = request.response;
		};

		request.send();
	}

	start() {
		this.nextNoteTime = this.audioContext.currentTime + 0.05;

		this.metronomeInterval = setInterval(() => this.runScheduler(), this.DORMANT_DURATION);
	}

	stop() {
		clearInterval(this.metronomeInterval);
	}

	runScheduler() {
		while (this.nextNoteTime < this.audioContext.currentTime + this.SCHEDULE_AHEAD_TIME) {
			this.scheduleNote(this.nextNoteTime);
			this.determineNextNoteTime();
		}
	}

	scheduleNote(timeToSchedule) {
		let bufferClone = this.buffer.slice(0);
		this.audioContext
			.decodeAudioData(bufferClone)
			.then((decodedData) => {
				let sound = this.audioContext.createBufferSource();
				sound.buffer = decodedData;

				sound.connect(this.audioContext.destination);
				sound.start(timeToSchedule);
				sound.stop(timeToSchedule + 0.03);
			})
			.catch((error) => console.error(error));

		// const sound = this.audioContext.createOscillator();
		// sound.frequency.value = 800;
	}

	determineNextNoteTime() {
		let beatDuration = this.SECONDS_IN_MINUTE / this.bpm;
		this.nextNoteTime += beatDuration;
	}

	toggle() {}

	changeBpm(newBpm) {
		if (isNaN(newBpm)) {
			this.bpm = 0;
		} else {
			this.bpm = newBpm;
		}
	}
}
