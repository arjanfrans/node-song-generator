'use strict';

const teoria = require('teoria');
const piu = require('piu');
const helper = require('./helpers');

function chordStepsWithQuality(chords, quality) {
    let steps = [];

    chords.forEach((chord, index) => {
        if (chord.quality() === quality) {
            steps.push(index);
        }
    });

    return steps;
}

module.exports = {

    /**
     * Get the chords of a given scale, sorted by it's position in the scale.
     */
    scaleChords (root, quality) {
        let tonic = teoria.note.fromString(root);
        let scale = teoria.scale(tonic, quality);
        let notes = [];

        for (let i = 1; i < 8; i++) {
            let note = scale.get(i);

            notes.push(note);
        }

        let chords = piu.infer(notes).map((chord, index) => {
           return teoria.chord(chord.root + chord.type)
        });

        let sortedChords = [];

        for (let note of notes) {
            for (let chord of chords) {
                let noteName = note.name() + note.accidental();

                if (chord.name.toLowerCase().startsWith(noteName.toLowerCase())) {
                    sortedChords.push(chord);
                }
            }
        }

        return sortedChords;
    },

    /**
     * Generate a chord progression.
     */
    createProgression (chords, possibleSteps, options) {
        options = options || {};
        options.bars = options.bars || 4;
        options.firstOnce = options.firstOnce || false;
        options.maxOccurances = options.maxOccurances || 2;
        options.notFirst = options.notFirst || [];
        options.notLast = options.notLast || [];
        options.stepOccurance = options.stepOccurance || {};
        options.lastQuality = options.lastQuality || null;

        let progression = [];

        for (let i = 0; i < options.bars; i++) {
            if (i === 0 && typeof options.startChord !== 'undefined') {
                progression[0] = options.startChord;
            } else if (i === options.bars - 1 && typeof options.endChord !== 'undefined') {
                progression[i] = options.endChord;
            } else if (i === options.bars - 1 && options.lastQuality) {
                let not = [].concat(options.notLast);
                let value = helper.randomValue(possibleSteps, not);

                let chord = chords[value];

                if (chord.quality() !== options.lastQuality) {
                    if (options.lastQuality === 'major') {
                        let minors = chordStepsWithQuality(chords, 'minor');

                        value = helper.randomValue(possibleSteps, not.concat(minors));
                    } else if (options.lastQuality === 'minor') {
                        let majors = chordStepsWithQuality(chords, 'major');

                        value = helper.randomValue(possibleSteps, not.concat(majors));
                    }
                }

                progression[i] = value;
            } else {
                let not = [];

                if (i === 0) {
                    not = not.concat(options.notFirst);
                } else if (i === options.bars - 1) {
                    not = not.concat(options.notLast);
                }

                if (i > 0 && options.firstOnce) {
                    not.push(progression[0]);
                }

                let value = helper.randomValue(possibleSteps, not);

                if (options.stepOccurance[value]) {
                    if (helper.arrayOccurances(progression)[value] > options.stepOccurance[value]) {
                        value = helper.randomValue(possibleSteps, not.concat([value]));
                    }
                } else if (options.maxOccurances) {
                    if (helper.arrayOccurances(progression)[value] >= options.maxOccurances) {
                        value = helper.randomValue(possibleSteps, not.concat([value]));
                    }
                }

                progression[i] = value;
            }
        }

        return progression.map(step => {
            return {
                chord: chords[step],
                step: step
            };
        });
    }
};
