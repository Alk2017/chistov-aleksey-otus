const request = require('supertest')
const express = require('express')
const random = require("../models/utils");
var {userRouter} = require('./users.js');
const {User} = require("../models/user");
const {mongoose} = require("mongoose");

const app = express()
app.use(express.json())
app.use('/users', userRouter);

mongoose.connect(
    'mongodb://localhost:27017/test_db?authSource=admin&directConnection=true'
).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

afterAll( () => {
  mongoose.disconnect();
})


describe('User CRUD operations', () => {

  beforeAll( () => {
    User.collection.drop()
  })

  it('should create a new user', async () => {
    const user = random.createRandomUser()

    const response = await request(app)
      .post('/users')
      .send(user)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.role).toBe(user.role)
    expect(response.body.rating).toStrictEqual(user.rating)
  })

  it('should get a user by ID', async () => {
    const user = await User.create(random.createRandomUser())
    const response = await request(app).get(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(user.id)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.role).toBe(user.role)
    expect(response.body.rating).toStrictEqual(user.rating)
  })

  it('should update a user by ID', async () => {
    const user = await User.create(random.createRandomUser())

    const userNew = random.createRandomUser()

    const response = await request(app)
      .put(`/users/${user.id}`)
      .send(userNew)
    const users = await User.find()


    expect(response.status).toBe(200)
    expect(response.body._id).toBe(user.id)
    expect(response.body.name).toBe(userNew.name)
    expect(response.body.email).toBe(userNew.email)
    expect(response.body.role).toBe(userNew.role)
    expect(response.body.rating).toStrictEqual(userNew.rating)
  })

  it('should delete a user by ID', async () => {
    const user = await User.create(random.createRandomUser())
    const response = await request(app).delete(`/users/${user.id}`)
    expect(response.status).toBe(204)

    const deletedUser = await User.findById(user.id)
    expect(deletedUser).toBe(null)
  })

  it('should return 404 when trying to get a unexist user', async () => {
    const unexistUserId = random.randomString(24)
    const response = await request(app).get(`/users/${unexistUserId}`)

    expect(response.status).toBe(404)
  })
})

describe('Users operations', () => {

  beforeAll( () => {
    User.collection.drop()
  })

  it('should get all users', async () => {

    const userModel1 =  random.createRandomUser()
    const userModel2 =  random.createRandomUser()
    const userModel3 =  random.createRandomUser()
    const user1 = await User.create(userModel1)
    const user2 = await User.create(userModel2)
    const user3 = await User.create(userModel3)
    userModel1._id = user1.id
    userModel2._id = user2.id
    userModel3._id = user3.id
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)

    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(userModel1)
    expect(response.body).toContainEqual(userModel2)
    expect(response.body).toContainEqual(userModel3)
  })
})

describe('User rating operations', () => {

  beforeAll( () => {
    User.collection.drop()
  })

  it.each([
    [[5], 5],
    [[1, 2, 5], 3],
    [[1, 2, 3], 2],
    [[1], 1],
    [[], 0],
  ])('should get a user rating(exist ratings: %p)', async (ratingArray, rating) => {
    const userModel =  random.createRandomUser()
    userModel.rating = ratingArray
    const user = await User.create(userModel)

    const response = await request(app).get(`/users/${user.id}/rating`)
    expect(response.status).toBe(200)
    expect(response.body.averageRating).toBe(rating)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a user rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const userModel =  random.createRandomUser()
    userModel.rating = existRating
    const user = await User.create(userModel)

    const response = await request(app)
        .patch(`/users/${user.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(user.id)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
    expect(response.body.rating).toStrictEqual(expectRating)
  });
})