const random = require("../models/utils");

// User Model
class User {
    constructor(id = null,
                name = random.randomString(8),
                email = random.randomString(6) + '@mail.ru',
                rating = [],) {
        this.id = id
        this.name = name
        this.email = email
        this.rating = rating
    }
}

// User Repository
class UserRepository {
    #users = []
    #nextId = 1

    getAll () {
        return this.#users
    }

    getById (id) {
        return this.#users.find(user => user.id === id)
    }

    create (user) {
        user.id = this.#nextId++
        this.#users.push(user)
        return user
    }

    update (id, updatedUser) {
        const index = this.#users.findIndex(user => user.id === id)
        if (index !== -1) {
            this.#users[index] = { id, ...updatedUser }
            return this.#users[index]
        }
        return null
    }

    delete (id) {
        const index = this.#users.findIndex(user => user.id === id)
        if (index !== -1) {
            return this.#users.splice(index, 1)
        }
        return null
    }

    rating (id, rating) {
    //     pass
    }
}

module.exports = {UserRepository, User};