export default class Metronome {
	constructor(bpm = 120) {
		this.audioContext = null;
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
	}

	start() {
		this.audioContext = new window.AudioContext() || new window.webkitAudioContext();
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
		const sound = this.audioContext.createOscillator();
		sound.frequency.value = 800;

		sound.connect(this.audioContext.destination);
		sound.start(timeToSchedule);
		sound.stop(timeToSchedule + 0.03);
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
