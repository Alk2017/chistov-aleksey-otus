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

function randomItemFromList(list) {
    return list[Math.floor(Math.random()* list.length)];
}

function createRandomUser() {
    return {
        name: randomString(8)
        , email: randomString(6) + '@mail.ru'
        , role: randomItemFromList(['ADMIN', 'AUTHOR', 'USER'])
        , rating: generateRandomNumbers(5, 1, 5)
    }
}

function createRandomCourse(authorId, students = []) {
    return {
        name: randomString(15),
        description: randomString(20),
        authorId: authorId,
        tags: [randomString(8), randomString(8), randomString(8)],
        difficulty: randomItemFromList(['EASY', 'MEDIUM', 'HARD']),
        rating: generateRandomNumbers(5, 1, 5),
        lessons: [],
        students: students
    }
}

function randomCourseComment(courseId, authorId = undefined, comment= randomString(15)) {
    return {
        "authorId": authorId,
        "courseId": courseId,
        "comment": comment,
    }
}

module.exports = {
    randomString,
    randomInt,
    generateRandomNumbers,
    generateRandomStrings,
    createRandomUser,
    createRandomCourse,
    randomCourseComment
}