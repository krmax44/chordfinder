import Midy from 'midy';
import { midiToNoteName } from '@tonaljs/midi';
import { detect } from '@tonaljs/chord-detect';

const chordNameEl = document.querySelector('.chordname');
const errorEl = document.querySelector('.error');
const notes = new Set();

function updateChord() {
  if (notes.size < 2) {
    chordNameEl.innerText = '🎹';
    return;
  }

  const noteNames = [...notes].sort().map(n => midiToNoteName(n));
  const chordNames = detect(noteNames);

  if (chordNames.length === 0) {
    chordNameEl.innerText = '🤔';
    return;
  }

  chordNameEl.innerHTML = chordNames.join('<br>');
}

if (navigator.requestMIDIAccess) {
  const midy = new Midy();
  midy.requestAccess().then(access => {
    if (!access) {
      errorEl.innerText = '⚠ MIDI access was denied.';
      return;
    }

    updateChord();
  });

  midy.on('noteDown', note => {
    notes.add(note);
    updateChord();
  });

  midy.on('noteUp', note => {
    notes.delete(note);
    updateChord();
  });
} else {
  errorEl.innerText = "❌ Your browser doesn't have Web MIDI support.";
}