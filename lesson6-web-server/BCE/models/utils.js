const { randomBytes } = require('node:crypto');

function randomString(length) {
    if (length % 2 !== 0) {
        length++;
    }
    return randomBytes(length / 2).toString("hex");
}

function randomInt(min = 0, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumbers(length, min, max) {
    return Array.from({ length }, () => randomInt(min, max));
}

function generateRandomStrings(lengthArray, lengthLine) {
    return Array.from({ length: lengthArray }, () => randomString(lengthLine));
}

module.exports = {
    randomString,
    randomInt,
    generateRandomNumbers,
    generateRandomStrings,
}