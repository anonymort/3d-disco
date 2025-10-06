import { AUDIO_CONFIG } from './config.js';

export function createAudioSystem() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = AUDIO_CONFIG.volume;
    masterGain.connect(audioContext.destination);

    // Low-pass filter for muffled effect
    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.value = AUDIO_CONFIG.lowPassFrequency;
    lowPassFilter.Q.value = 1;
    masterGain.connect(lowPassFilter);
    lowPassFilter.connect(audioContext.destination);

    return { audioContext, masterGain };
}

function playKick(audioContext, masterGain, time) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.5);
}

function playHiHat(audioContext, masterGain, time) {
    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize / 20));
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    noise.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
}

function playBass(audioContext, masterGain, time, frequency) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, time);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
}

export function startBeat(audioContext, masterGain) {
    let beatCount = 0;

    function scheduleBeat() {
        const now = audioContext.currentTime;
        const beatTime = now + 0.1;

        // Kick on every beat
        if (beatCount % 2 === 0) {
            playKick(audioContext, masterGain, beatTime);
        }

        // Hi-hat on off-beats
        if (beatCount % 2 === 1) {
            playHiHat(audioContext, masterGain, beatTime);
        }

        // Bass pattern
        if (beatCount % 8 === 0) {
            playBass(audioContext, masterGain, beatTime, 65.41); // C2
        } else if (beatCount % 8 === 4) {
            playBass(audioContext, masterGain, beatTime, 82.41); // E2
        }

        beatCount++;
    }

    setInterval(scheduleBeat, AUDIO_CONFIG.beatInterval);
}
