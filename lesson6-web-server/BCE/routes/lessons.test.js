const request = require('supertest')
const express = require('express')
const random = require("../models/utils");
const {mongoose} = require("mongoose");
const {User} = require("../models/user");
const {clearCollections} = require("./testUtils");
const {Lesson} = require("../models/lesson");
const {lessonRouter} = require("./lessons");
const {LessonComment} = require("../models/lessonComment");

const app = express()
app.use(express.json())
app.use('/lessons', lessonRouter);

mongoose.connect(
    'mongodb://localhost:27017/test_db?authSource=admin&directConnection=true'
).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

afterAll( () => {
  mongoose.disconnect();
})

describe('Lesson CRUD operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it('should create a new lesson', async () => {
    const author = await User.create(random.createRandomUser())
    const lesson = random.createRandomLesson(author.id)

    const response = await request(app)
        .post('/lessons')
        .send(lesson)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.description).toBe(lesson.description)
    expect(response.body.authorId).toBe(lesson.authorId)
    expect(response.body.links).toStrictEqual(lesson.links)
    expect(response.body.files).toStrictEqual(lesson.files)
    expect(response.body.rating).toStrictEqual(lesson.rating)
  })

  it('should get a lesson by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const lesson = await Lesson.create(random.createRandomLesson(author.id))

    const response = await request(app).get(`/lessons/${lesson.id}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(lesson.id)
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.description).toBe(lesson.description)
    expect(response.body.authorId).toBe(lesson.authorId.toString())
    expect(response.body.links).toStrictEqual(lesson.links)
    expect(response.body.files).toStrictEqual(lesson.files)
    expect(response.body.rating).toStrictEqual(lesson.rating)
  })

  it('should update a lesson by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const lesson = await Lesson.create(random.createRandomLesson(author.id))

    const authorNew = await User.create(random.createRandomUser())
    const lessonNew = random.createRandomLesson(authorNew.id)

    const response = await request(app)
        .put(`/lessons/${lesson.id}`)
        .send(lessonNew)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(lesson.id)
    expect(response.body.name).toBe(lessonNew.name)
    expect(response.body.description).toBe(lessonNew.description)
    expect(response.body.authorId).toBe(lessonNew.authorId)
    expect(response.body.links).toStrictEqual(lessonNew.links)
    expect(response.body.files).toStrictEqual(lessonNew.files)
    expect(response.body.rating).toStrictEqual(lessonNew.rating)
  })

  it('should delete a lesson by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const lesson = await Lesson.create(random.createRandomLesson(author.id))

    const response = await request(app).delete(`/lessons/${lesson.id}`)
    expect(response.status).toBe(204)

    const deletedLesson = await Lesson.findById(lesson.id)
    expect(deletedLesson).toBe(null)
  })

  it('should return 404 when trying to get a deleted lesson', async () => {
    const unexistLesson = new Lesson()
    const response = await request(app).get(`/lessons/${unexistLesson.id}`)

    expect(response.status).toBe(404)

  })
})

describe('Lessons operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it('should get all lessons', async () => {
    const author1 = await User.create(random.createRandomUser())
    const lessonModel1 = random.createRandomLesson(author1.id)
    const lesson1 = await Lesson.create(lessonModel1)
    const author2 = await User.create(random.createRandomUser())
    const lessonModel2 = random.createRandomLesson(author2.id)
    const lesson2 = await Lesson.create(lessonModel2)
    const author3 = await User.create(random.createRandomUser())
    const lessonModel3 = random.createRandomLesson(author3.id)
    const lesson3 = await Lesson.create(lessonModel3)

    const response = await request(app).get('/lessons')

    lessonModel1._id = lesson1.id
    lessonModel2._id = lesson2.id
    lessonModel3._id = lesson3.id

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(lessonModel1)
    expect(response.body).toContainEqual(lessonModel2)
    expect(response.body).toContainEqual(lessonModel3)
  })
})

describe('Lesson rating operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it.each([
    [[5], 5],
    [[1, 2, 5], 3],
    [[1, 2, 3], 2],
    [[1], 1],
    [[], 0],
  ])('should get a lesson rating(exist ratings: %p)', async (ratingArray, rating) => {
    const author = await User.create(random.createRandomUser())
    const lessonModel = random.createRandomLesson(author.id)
    lessonModel.rating = ratingArray
    const lesson = await Lesson.create(lessonModel)

    const response = await request(app).get(`/lessons/${lesson.id}/rating`)
    expect(response.status).toBe(200)
    expect(response.body.averageRating).toBe(rating)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a lesson rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const author = await User.create(random.createRandomUser())
    const lessonModel = random.createRandomLesson(author.id)
    lessonModel.rating = existRating
    const lesson = await Lesson.create(lessonModel)

    const response = await request(app)
        .patch(`/lessons/${lesson.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(lesson.id)
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.email).toBe(lesson.email)
    expect(response.body.rating).toStrictEqual(expectRating)
  });
})

describe('Lesson comments operations', () => {
  beforeAll( async () => {
    await clearCollections()
  })

  it('should get all comments for certain lesson', async () => {
    const author = await User.create(random.createRandomUser())
    const user = await User.create(random.createRandomUser())
    const lesson = await Lesson.create(random.createRandomLesson(author.id))
    const commentModel1 = random.randomLessonComment(lesson.id, author.id)
    const commentModel2 = random.randomLessonComment(lesson.id, author.id)
    const commentModel3 = random.randomLessonComment(lesson.id, user.id)
    const comment1 = await LessonComment.create(commentModel1)
    const comment2 = await LessonComment.create(commentModel2)
    const comment3 = await LessonComment.create(commentModel3)

    const response = await request(app).get(`/lessons/${lesson.id}/comments`)

    commentModel1._id = comment1.id
    commentModel2._id = comment2.id
    commentModel3._id = comment3.id
    commentModel1.createdAt = comment1.createdAt.toISOString()
    commentModel2.createdAt = comment2.createdAt.toISOString()
    commentModel3.createdAt = comment3.createdAt.toISOString()
    commentModel1.updatedAt = comment1.updatedAt.toISOString()
    commentModel2.updatedAt = comment2.updatedAt.toISOString()
    commentModel3.updatedAt = comment3.updatedAt.toISOString()
    delete commentModel1.lessonId
    delete commentModel2.lessonId
    delete commentModel3.lessonId

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(commentModel1)
    expect(response.body).toContainEqual(commentModel2)
    expect(response.body).toContainEqual(commentModel3)
  })

  it('should create comment for certain lesson', async () => {
    const author = await User.create(random.createRandomUser())
    const lesson = await Lesson.create(random.createRandomLesson(author.id))
    const newComment = random.randomLessonComment(lesson.id, author.id)
    newComment.username = author.name

    const response = await request(app)
        .post(`/lessons/${lesson.id}/comments`)
        .send(newComment)

    console.log(response.body)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.authorId).toBe(newComment.authorId)
    expect(response.body.lessonId).toBe(lesson.id)
    expect(response.body.comment).toBe(newComment.comment)
  })
})
