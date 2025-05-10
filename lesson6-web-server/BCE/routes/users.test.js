const request = require('supertest')
const express = require('express')
const random = require("../models/utils");
var {userRouter, userRepository} = require('./users.js');
const {User} = require("../models/user");

const app = express()
app.use(express.json())
app.use('/users', userRouter);

describe('User CRUD operations', () => {
  it('should create a new user', async () => {
    const user = new User()

    const response = await request(app)
      .post('/users')
      .send(user)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.rating).toStrictEqual(user.rating)

    userRepository.delete(response.body.id)
  })

  it('should get a user by ID', async () => {
    const user = new User()
    user.id = userRepository.create(user).id


    const response = await request(app).get(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', user.id)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.rating).toStrictEqual(user.rating)

    userRepository.delete(user.id)
  })

  it('should update a user by ID', async () => {
    const user = new User()
    user.id = userRepository.create(user).id

    const userNew = new User()
    userNew.rating = [5]

    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: userNew.name, email: userNew.email, rating: userNew.rating })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', user.id)
    expect(response.body.name).toBe(userNew.name)
    expect(response.body.email).toBe(userNew.email)
    expect(response.body.rating).toStrictEqual(userNew.rating)

    userRepository.delete(user.id)
  })

  it('should delete a user by ID', async () => {
    const user = new User()
    user.id = userRepository.create(user).id

    const response = await request(app).delete(`/users/${user.id}`)

    expect(response.status).toBe(204)

    expect(userRepository.getAll().length).toBe(0)
  })

  it('should return 404 when trying to get a deleted user', async () => {
    const unexistUser = new User()
    const response = await request(app).get(`/users/${unexistUser.id}`)

    expect(response.status).toBe(404)
  })
})

describe('Users operations', () => {
  it('should get all users', async () => {
    const user1 = new User()
    const user2 = new User()
    const user3 = new User()
    user1.id = userRepository.create(user1).id
    user2.id = userRepository.create(user2).id
    user3.id = userRepository.create(user3).id

    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(user1)
    expect(response.body).toContainEqual(user2)
    expect(response.body).toContainEqual(user3)

    userRepository.delete(user1.id)
    userRepository.delete(user2.id)
    userRepository.delete(user3.id)
  })
})

describe('User rating operations', () => {
  it.each([
    [[5], 5],
    [[1, 2, 4], 2.33],
    [[1, 2, 3], 2],
    [[0], 0],
  ])('should get a user rating(exist ratings: %p)', async (ratingArray, rating) => {
    const user = new User(null, random.randomString(8), random.randomString(6) + '@mail.ru', ratingArray)
    user.id = userRepository.create(user).id


    const response = await request(app).get(`/users/${user.id}/rating`)

    expect(response.status).toBe(200)
    expect(response.body.rating).toBe(rating)

    userRepository.delete(user.id)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a user rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const user = new User(null, random.randomString(8), random.randomString(6) + '@mail.ru', existRating)
    user.id = userRepository.create(user).id


    const response = await request(app)
        .patch(`/users/${user.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(204)
    expect(response.body).toHaveProperty('id', user.id)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.rating).toStrictEqual(expectRating)

    userRepository.delete(user.id)
  });
})