const request = require('supertest')
const express = require('express')
var {router, userRepository} = require('./users.js');
const {User} = require("../models/user");

const app = express()
app.use(express.json())
app.use('/users', router);

describe('User API CRUD operations', () => {
  it('should create a new user', async () => {
    const user = new User()

    const response = await request(app)
      .post('/users')
      .send(user)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)

    console.log(user)
    userRepository.delete(response.body.id)
  })

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

  it('should get a user by ID', async () => {
    const user = new User()
    user.id = userRepository.create(user).id


    const response = await request(app).get(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', user.id)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)

    userRepository.delete(user.id)
  })

  it('should update a user by ID', async () => {
    const user = new User()
    user.id = userRepository.create(user).id

    const userNew = new User()

    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: userNew.name, email: userNew.email })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', user.id)
    expect(response.body.name).toBe(userNew.name)
    expect(response.body.email).toBe(userNew.email)

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

