const {User} = require("../models/user");
const {Course} = require("../models/course");

async function clearCollections() {
    const courseCount = await Course.countDocuments()
    const userCount = await User.countDocuments()

    if (courseCount) {
        await Course.collection.drop()
    }
    if (userCount) {
        await User.collection.drop()
    }

}

module.exports = {
    clearCollections
}