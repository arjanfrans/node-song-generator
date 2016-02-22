'use strict';

const teoria = require('teoria');
const piu = require('piu');

let common = [
    [0, 3, 4, 0],
    [0, 6, 4, 5] // Fade to black
];

function shuffleProgression (progression) {
    let uniqueIntervals = uniqueArray(progression);

    // Key as the first chord
    let newProgression = [0];

    for (let i = 1; i < 4; i++) {
        let interval = uniqueIntervals[Math.floor(Math.random() * uniqueIntervals.length)];

        if (newProgression.indexOf(interval) === -1) {
            newProgression.push(interval);
        } else if (arrayOccurances(newProgression)[interval] > 1) {
            removeValue(uniqueIntervals);

            interval = uniqueIntervals[Math.floor(Math.random() * uniqueIntervals.length)];
        } else {
            newProgression.push(interval);
        }
    }

    return newProgression;
}

function createSong () {
    let scale = teoria.scale('a', 'minor');
    let notes = scale.notes();

    let chords = piu.infer(scale.notes()).map(chord => {
        return teoria.chord(chord.root + chord.type);
    });

    let progression = shuffleProgression(common[1]);
    let verse = progression.map(interval => {
        return chords[interval];
    });

    console.log(verse);
}

function uniqueArray(array) {
    return array.filter((element, index) => {
        return array.indexOf(element) === index;
    });
}

function arrayOccurances(array) {
    return array.reduce((acc, curr) => {
        if (typeof acc[curr] === 'undefined') {
            acc[curr] = 1;
        } else {
            acc[curr] += 1;
        }

        return acc;
    }, {});
}

function removeValue(array, value) {
    let index = array.indexOf(value);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

createSong();
