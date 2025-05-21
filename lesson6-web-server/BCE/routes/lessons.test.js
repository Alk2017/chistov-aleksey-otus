const request = require('supertest')
const express = require('express')
var {lessonRouter, lessonRepository, lessonCommentsRepository} = require('./lessons.js');
const random = require("../models/utils");
// const {Lesson} = require("../models/lesson");
// const {LessonComment} = require("../models/lessonComment");

const app = express()
app.use(express.json())
app.use('/lessons', lessonRouter);

describe('Lesson CRUD operations', () => {
  it('should create a new lesson', async () => {
    const lesson = new Lesson()

    const response = await request(app)
      .post('/lessons')
      .send(lesson)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.description).toBe(lesson.description)
    expect(response.body.links).toStrictEqual(lesson.links)
    expect(response.body.files).toStrictEqual(lesson.files)
    expect(response.body.rating).toStrictEqual(lesson.rating)

    lessonRepository.delete(response.body.id)
  })

  it('should get a lesson by ID', async () => {
    const lesson = new Lesson()
    lesson.id = lessonRepository.create(lesson).id

    const response = await request(app).get(`/lessons/${lesson.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', lesson.id)
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.description).toBe(lesson.description)
    expect(response.body.links).toStrictEqual(lesson.links)
    expect(response.body.files).toStrictEqual(lesson.files)
    expect(response.body.rating).toStrictEqual(lesson.rating)

    lessonRepository.delete(lesson.id)
  })

  it('should update a lesson by ID', async () => {
    const lesson = new Lesson()
    lesson.id = lessonRepository.create(lesson).id

    const lessonNew = new Lesson()

    const response = await request(app)
      .put(`/lessons/${lesson.id}`)
      .send({ name: lessonNew.name, email: lessonNew.email })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', lesson.id)
    expect(response.body.name).toBe(lessonNew.name)
    expect(response.body.description).toBe(lessonNew.description)
    expect(response.body.links).toStrictEqual(lessonNew.links)
    expect(response.body.files).toStrictEqual(lessonNew.files)
    expect(response.body.rating).toStrictEqual(lessonNew.rating)

    lessonRepository.delete(lesson.id)
  })

  it('should delete a lesson by ID', async () => {
    const lesson = new Lesson()
    lesson.id = lessonRepository.create(lesson).id

    const response = await request(app).delete(`/lessons/${lesson.id}`)

    expect(response.status).toBe(204)

    expect(lessonRepository.getById(lesson.id)).toBe(null)
  })

  it('should return 404 when trying to get a deleted lesson', async () => {
    const unexistLesson = new Lesson()
    const response = await request(app).get(`/lessons/${unexistLesson.id}`)

    expect(response.status).toBe(404)
  })
})

describe('Lesson rating operations', () => {
  it.each([
    [[5], 5],
    [[1, 2, 4], 2.33],
    [[1, 2, 3], 2],
    [[0], 0],
  ])('should get a lesson rating(exist ratings: %p, expecting average: %p)', async (ratingArray, rating) => {
    const lesson = new Lesson(undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ratingArray)
    lesson.id = lessonRepository.create(lesson).id


    const response = await request(app).get(`/lessons/${lesson.id}/rating`)

    expect(response.status).toBe(200)
    expect(response.body.rating).toBe(rating)

    lessonRepository.delete(lesson.id)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a lesson rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const lesson = new Lesson(undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ratingArray
        )
    lesson.id = lessonRepository.create(lesson).id


    const response = await request(app)
        .patch(`/lessons/${lesson.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(204)
    expect(response.body).toHaveProperty('id', lesson.id)
    expect(response.body.name).toBe(lesson.name)
    expect(response.body.description).toBe(lesson.description)
    expect(response.body.authorId).toBe(lesson.authorId)
    expect(response.body.tags).toStrictEqual(lesson.tags)
    expect(response.body.difficult).toBe(lesson.difficult)
    expect(response.body.rating).toStrictEqual(expectRating)
    expect(response.body.lessons).toStrictEqual(lesson.lessons)
    expect(response.body.students).toStrictEqual(lesson.students)

    lessonRepository.delete(lesson.id)
  });
})

describe('Lesson comments operations', () => {
  it('should get all comments for certain lesson', async () => {
    const lesson = new Lesson()
    lesson.id = lessonRepository.create(lesson).id
    const comment1 = new Comment(lesson.id)
    const comment2 = new Comment(lesson.id)
    const comment3 = new Comment(lesson.id)
    comment1.id = lessonCommentsRepository.create(comment1).id
    comment2.id = lessonCommentsRepository.create(comment2).id
    comment3.id = lessonCommentsRepository.create(comment3).id

    const response = await request(app).get('/lessons/${lesson.id}/comments')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(comment1)
    expect(response.body).toContainEqual(comment2)
    expect(response.body).toContainEqual(comment3)

    lessonRepository.delete(lesson.id)
    lessonCommentsRepository.delete(comment1.id)
    lessonCommentsRepository.delete(comment2.id)
    lessonCommentsRepository.delete(comment3.id)
  })

  it('should create comment for certain lesson', async () => {
    const lesson = new Lesson()
    lesson.id = lessonRepository.create(lesson).id
    const newComment = new Comment(lesson.id)

    const response = await request(app)
        .post('/lessons/${lesson.id}/comments')
        .send(newComment)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.authorId).toBe(newComment.authorId)
    expect(response.body.lessonId).toBe(newComment.lessonId)
    expect(response.body.note).toBe(newComment.note)
    expect(response.body.createDate).toBe(newComment.createDate)

    lessonRepository.delete(lesson.id)
    lessonCommentsRepository.delete(newComment.id)
  })
})
