import lowClick from '../clicks/low.wav';
import { reportError } from '../utils/error';

export default class Metronome {
  // `declare`: types only, so the class body compiles as before. The
  // constructor (or the click's request) assigns each one.
  declare audioContext: AudioContext | null;
  declare notesInQueue: { note: number; time: number }[];
  /** 0 to 3. */
  declare currentQuarterNote: number;
  /** Beats per minute. Undefined for a song without a bpm. */
  declare tempo: number | undefined;
  /** How often the scheduler runs, in milliseconds. */
  declare lookahead: number;
  /** How far ahead notes are scheduled, in seconds. */
  declare scheduleAheadTime: number;
  /** In the audio context's time, in seconds. */
  declare nextNoteTime: number;
  declare isRunning: boolean;
  declare intervalID: ReturnType<typeof setInterval> | null;
  /** Nothing sets 'click', so it's always a beep. */
  declare sound: 'beep' | 'click';
  /** The click sound's data, once its request loads. */
  declare buffer: ArrayBuffer | undefined;

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
    this.sound = 'beep';

    const request = new XMLHttpRequest();
    request.open('GET', lowClick, true);

    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.buffer = request.response;
    };

    request.send();
  }

  nextNote() {
    // Non-null: kept as before for a song without a bpm, where this is NaN,
    // so after the first note the scheduler schedules no more.
    const secondsPerBeat = 60.0 / this.tempo!;
    this.nextNoteTime += secondsPerBeat;

    this.currentQuarterNote++;
    if (this.currentQuarterNote === 4) {
      this.currentQuarterNote = 0;
    }
  }

  async scheduleNote(beatNumber: number, timeToSchedule: number) {
    this.notesInQueue.push({ note: beatNumber, time: timeToSchedule });

    const soundNode = await this.getSound();
    // Non-null (both): the scheduler runs only after start() creates the
    // audio context. getSound returns nothing only when the click failed to
    // decode, which it reports; kept as before, this then throws.
    soundNode!.connect(this.audioContext!.destination);
    soundNode!.start(timeToSchedule);
    soundNode!.stop(timeToSchedule + 0.03);
  }

  async getSound() {
    if (this.sound === 'click') {
      try {
        // Non-null: kept as before, this throws before the click loads, and
        // the catch reports it.
        const bufferClone = this.buffer!.slice(0);
        // Non-null (here and below): only scheduleNote calls this, once
        // start() has created the audio context.
        const decodedData =
          await this.audioContext!.decodeAudioData(bufferClone);

        const clickNode = this.audioContext!.createBufferSource();
        clickNode.buffer = decodedData;
        return clickNode;
      } catch (error) {
        reportError(error);
      }
    } else {
      const beepNode = this.audioContext!.createOscillator();
      beepNode.frequency.value = 800;
      return beepNode;
    }
  }

  scheduler() {
    // Non-null: the scheduler runs only after start() creates the audio
    // context.
    while (
      this.nextNoteTime <
      this.audioContext!.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  start() {
    if (this.isRunning) return;

    if (this.audioContext === null) {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }

    this.isRunning = true;

    this.currentQuarterNote = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    this.isRunning = false;

    // `as`: before the first start() this is null, and clearInterval(null)
    // clears nothing, like clearInterval(undefined).
    clearInterval(
      this.intervalID as ReturnType<typeof setInterval> | undefined
    );
  }
}
