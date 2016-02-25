'use strict';

const chordUtil = require('./chords');

function createVerse(chords) {
    let possibleSteps = [0, 2, 3, 5, 6];
    let progression = chordUtil.createProgression(chords, possibleSteps, {
        startChord: 0
    });

    return progression;
}

function createChorus(chords) {
    let possibleSteps = [0, 2, 3, 4, 5, 6];

    let progression = chordUtil.createProgression(chords, possibleSteps, {
        notFirst: [0],
        notLast: [0]
    });

    return progression;
}

function printSong(parts) {
    let lines = [];

    Object.keys(parts).forEach((partName, index) => {
        let part = parts[partName];

        lines.push((index === 0 ? '' : '\n') + partName);

        lines = lines.concat(part.map(partLine => {
            return partLine.map(chord => chord.name).join(' ');
        }));
    });

    let output = lines.join('\n');

    console.log(output)
}

module.exports = {
    createSong: function (root, quality) {
        let chords = chordUtil.scaleChords(root, quality);

        let verse = createVerse(chords);
        let chorus = createChorus(chords);

        let parts = {
            verse: [
                verse,
                verse
            ],
            chorus: [
                chorus,
                chorus
            ]
        }

        printSong(parts)
    }
};
