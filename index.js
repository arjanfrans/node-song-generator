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

    let chorusProgressions = createChorus(verse);

    let chorusA = chorusProgressions[0].map(interval => chords[interval]);
    let chorusB = chorusProgressions[1].map(interval => chords[interval]);

    let preChorusProgression = createPreChorus(verseProgression, chorusProgressions[0]);

    let preChorusA = preChorusProgression[0].map(interval => chords[interval]);
    let preChorusB = preChorusProgression[1].map(interval => chords[interval]);

    printSong([verse, verse, [], preChorusA, preChorusB, [], chorusA, chorusB]);
}

function createPreChorus(verse, chorus) {
    let notFirstOrLast = [3, verse[0], verse[3]];

    if (chorus) {
        notFirstOrLast.push(chorus[0]);
    }

    let progressionA = [];

    let first = [1, 2, 4, 5, 6];

    progressionA[0] = randomValue(first, notFirstOrLast);
    progressionA[1] = randomValue(INTERVALS);
    progressionA[2] = randomValue(INTERVALS, [progressionA[1]]);
    // Last is never the same as the first
    progressionA[3] = randomValue(INTERVALS, notFirstOrLast.concat([progressionA[0]]));

    let progressionB = progressionA.slice();

    let notLast = [progressionA[0], progressionA[3], 3, 0];

    if (chorus) {
        notLast.push(chorus[0]);
    }

    progressionB[3] = randomValue(INTERVALS, notLast);

    return [progressionA, progressionB];
}

function createChorus(verse) {
    let progressionA = [];

    progressionA[0] = randomValue(INTERVALS, [3]);
    progressionA[1] = randomValue(INTERVALS, [3]);

    let notNext = [3];

    if (progressionA[0] === progressionA[1]) {
        notNext.push(progressionA[0]);
    }

    progressionA[2] = randomValue(INTERVALS, notNext);

    let third = randomValue(INTERVALS, notNext.concat([progressionA[2]]));

    if (arrayOccurances(progressionA)[third] > 1) {
        progressionA[2] = randomValue(INTERVALS, notNext.concat([progressionA[2], third]));
    } else {
        progressionA[2] = third;
    }

    let fourth = randomValue(INTERVALS, notNext);

    if (arrayOccurances(progressionA)[fourth] > 1) {
        progressionA[3] = randomValue(INTERVALS, notNext.concat([fourth]));
    } else {
        progressionA[3] = fourth;
    }

    let progressionB = progressionA.slice();

    progressionB[3] = randomValue(INTERVALS, [progressionA[3]]);

    return [progressionA, progressionB];
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
