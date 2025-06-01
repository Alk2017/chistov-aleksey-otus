const {User} = require("../models/user");
const {Course} = require("../models/course");
const {Lesson} = require("../models/lesson");

async function clearCollections() {
    const courseCount = await Course.countDocuments()
    const userCount = await User.countDocuments()
    const lessonCount = await Lesson.countDocuments()

    if (courseCount) {
        await Course.collection.drop()
    }
    if (userCount) {
        await User.collection.drop()
    }
    if (lessonCount) {
        await Lesson.collection.drop()
    }

}

module.exports = {
    clearCollections
}