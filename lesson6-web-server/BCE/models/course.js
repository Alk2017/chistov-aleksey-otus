const random = require("./utils");

// Course Model
class Course {
    constructor(id = null,
                name = random.randomString(8),
                description = random.randomString(50),
                authorId = random.randomInt(),
                tags = random.generateRandomStrings(3, 5),
                // ....
                rating = random.generateRandomNumbers(3, 0, 5),
                ) {
        this.id = id
        this.name = name
        this.description = description
        this.authorId = authorId
        this.tags = tags
        // ......
        this.rating = rating
    }
}

// Course Repository
class CourseRepository {
    #courses = []
    #nextId = 1

    getAll () {
        //     pass
    }

    getById (id) {
        //     pass
    }

    create (user) {
        //     pass
    }

    update (id, updatedCourse) {
        //     pass
    }

    delete (id) {
        //     pass
    }

    rating (id, rating) {
    //     pass
    }
}

module.exports = {CourseRepository, Course};