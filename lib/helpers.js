'use strict';

module.exports = {
    uniqueArray: function (array) {
        return array.filter((element, index) => {
            return array.indexOf(element) === index;
        });
    },

    arrayOccurances: function (array) {
        return array.reduce((acc, curr) => {
            if (typeof acc[curr] === 'undefined') {
                acc[curr] = 1;
            } else {
                acc[curr] += 1;
            }

            return acc;
        }, {});
    },

    removeValue(array, value) {
        let index = array.indexOf(value);

        if (index !== -1) {
            array.splice(index, 1);
        }
    },


    randomValue (array, not) {
        if (not) {
            let excluded = array.filter(value => not.indexOf(value) === -1);

            return excluded[Math.floor(Math.random() * excluded.length)];
        }

        if (array.length === 0) {
            return null;
        }

        return array[Math.floor(Math.random() * array.length)];
    }
};
