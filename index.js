'use strict';

const teoria = require('teoria');
const piu = require('piu');

const verses = [
    [0, 6, 4, 5]
];

const INTERVALS = [0, 1, 2, 3, 4, 5, 6];
const preChorusStart = [1, 4, 6];

function randomValue(array, not) {
    if (not) {
        let excluded = array.filter(interval => not.indexOf(interval) === -1);

        return excluded[Math.floor(Math.random() * excluded.length)];
    }

    return array[Math.floor(Math.random() * array.length)];
}

function shuffleProgression (progression, keyFirst) {
    let uniqueIntervals = uniqueArray(progression);

    let newProgression = [];

    newProgression[0] = keyFirst ? 0 : randomValue(uniqueIntervals);
    newProgression[1] = randomValue(uniqueIntervals);

    // 2nd and 3rd never the same
    let third = randomValue(uniqueIntervals, [newProgression[1]]);

    if (arrayOccurances(newProgression)[third] > 1) {
        removeValue(uniqueIntervals, third);

        newProgression[2] = randomValue(uniqueIntervals, [third]);
    } else {
        newProgression[2] = third;
    }

    let fourth = randomValue(uniqueIntervals);

    if (arrayOccurances(newProgression)[fourth] > 1) {
        removeValue(uniqueIntervals, fourth);

        newProgression[3] = randomValue(uniqueIntervals, [fourth]);
    } else {
        newProgression[3] = fourth;
    }

    return newProgression;
}

function createSong () {
    let scale = teoria.scale('a', 'minor');
    let notes = scale.notes();

    let chords = piu.infer(scale.notes()).map(chord => {
        return teoria.chord(chord.root + chord.type);
    });

    let verseProgression = shuffleProgression(verses[0], true);
    let verse = verseProgression.map(interval => chords[interval]);

    let preChorusProgression = createPreChorus(verseProgression);

    let preChorus = preChorusProgression.map(interval => chords[interval]);

    printSong([verse, preChorus]);
}

function createPreChorus(verse, chorus) {
    let notFirstOrLast = [3, verse[0], verse[3]];

    if (chorus) {
        notFirstOrLast.push(chorus[0]);
    }

    let progression = [];

    let first = [1, 2, 4, 5, 6];

    progression[0] = randomValue(first, notFirstOrLast);
    progression[1] = randomValue(INTERVALS);
    progression[2] = randomValue(INTERVALS, [progression[1]]);
    progression[3] = randomValue(INTERVALS, notFirstOrLast);

    return progression;
}

function printSong(parts) {
    let output = parts.map(part => part.map(chord => chord.name).join(' ')).join('\n');

    console.log(output)
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
