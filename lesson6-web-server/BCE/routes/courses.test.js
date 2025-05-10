const request = require('supertest')
const express = require('express')
var {courseRouter, courseRepository, courseCommentsRepository} = require('./courses.js');
const random = require("../models/utils");
const {Course} = require("../models/course");
// const {CourseComment} = require("../models/curseComment");

const app = express()
app.use(express.json())
app.use('/courses', courseRouter);

describe('Course CRUD operations', () => {
  it('should create a new course', async () => {
    const course = new Course()

    const response = await request(app)
      .post('/courses')
      .send(course)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(course.name)
    expect(response.body.description).toBe(course.description)
    expect(response.body.authorId).toBe(course.authorId)
    expect(response.body.tags).toStrictEqual(course.tags)
    expect(response.body.difficult).toBe(course.difficult)
    expect(response.body.rating).toStrictEqual(course.rating)
    expect(response.body.lessons).toStrictEqual(course.lessons)
    expect(response.body.students).toStrictEqual(course.students)

    courseRepository.delete(response.body.id)
  })

  it('should get a course by ID', async () => {
    const course = new Course()
    course.id = courseRepository.create(course).id

    const response = await request(app).get(`/courses/${course.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', course.id)
    expect(response.body.name).toBe(course.name)
    expect(response.body.description).toBe(course.description)
    expect(response.body.authorId).toBe(course.authorId)
    expect(response.body.tags).toStrictEqual(course.tags)
    expect(response.body.difficult).toBe(course.difficult)
    expect(response.body.rating).toStrictEqual(course.rating)
    expect(response.body.lessons).toStrictEqual(course.lessons)
    expect(response.body.students).toStrictEqual(course.students)

    courseRepository.delete(course.id)
  })

  it('should update a course by ID', async () => {
    const course = new Course()
    course.id = courseRepository.create(course).id

    const courseNew = new Course()

    const response = await request(app)
      .put(`/courses/${course.id}`)
      .send({ name: courseNew.name, email: courseNew.email })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', course.id)
    expect(response.body.name).toBe(courseNew.name)
    expect(response.body.description).toBe(courseNew.description)
    expect(response.body.authorId).toBe(courseNew.authorId)
    expect(response.body.tags).toStrictEqual(courseNew.tags)
    expect(response.body.difficult).toBe(courseNew.difficult)
    expect(response.body.rating).toStrictEqual(courseNew.rating)
    expect(response.body.lessons).toStrictEqual(courseNew.lessons)
    expect(response.body.students).toStrictEqual(courseNew.students)

    courseRepository.delete(course.id)
  })

  it('should delete a course by ID', async () => {
    const course = new Course()
    course.id = courseRepository.create(course).id

    const response = await request(app).delete(`/courses/${course.id}`)

    expect(response.status).toBe(204)

    expect(courseRepository.getAll().length).toBe(0)
  })

  it('should return 404 when trying to get a deleted course', async () => {
    const unexistCourse = new Course()
    const response = await request(app).get(`/courses/${unexistCourse.id}`)

    expect(response.status).toBe(404)
  })
})

describe('Courses operations', () => {
  it('should get all courses', async () => {
    const course1 = new Course()
    const course2 = new Course()
    const course3 = new Course()
    course1.id = courseRepository.create(course1).id
    course2.id = courseRepository.create(course2).id
    course3.id = courseRepository.create(course3).id

    const response = await request(app).get('/courses')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(course1)
    expect(response.body).toContainEqual(course2)
    expect(response.body).toContainEqual(course3)

    courseRepository.delete(course1.id)
    courseRepository.delete(course2.id)
    courseRepository.delete(course3.id)
  })
})

describe('Course rating operations', () => {
  it.each([
    [[5], 5],
    [[1, 2, 4], 2.33],
    [[1, 2, 3], 2],
    [[0], 0],
  ])('should get a course rating(exist ratings: %p, expecting average: %p)', async (ratingArray, rating) => {
    const course = new Course(undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ratingArray)
    course.id = courseRepository.create(course).id


    const response = await request(app).get(`/courses/${course.id}/rating`)

    expect(response.status).toBe(200)
    expect(response.body.rating).toBe(rating)

    courseRepository.delete(course.id)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a course rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const course = new Course(undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ratingArray
        )
    course.id = courseRepository.create(course).id


    const response = await request(app)
        .patch(`/courses/${course.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(204)
    expect(response.body).toHaveProperty('id', course.id)
    expect(response.body.name).toBe(course.name)
    expect(response.body.description).toBe(course.description)
    expect(response.body.authorId).toBe(course.authorId)
    expect(response.body.tags).toStrictEqual(course.tags)
    expect(response.body.difficult).toBe(course.difficult)
    expect(response.body.rating).toStrictEqual(expectRating)
    expect(response.body.lessons).toStrictEqual(course.lessons)
    expect(response.body.students).toStrictEqual(course.students)

    courseRepository.delete(course.id)
  });
})

describe('Course comments operations', () => {
  it('should get all comments for certain course', async () => {
    const course = new Course()
    course.id = courseRepository.create(course).id
    const comment1 = new Comment(course.id)
    const comment2 = new Comment(course.id)
    const comment3 = new Comment(course.id)
    comment1.id = courseCommentsRepository.create(comment1).id
    comment2.id = courseCommentsRepository.create(comment2).id
    comment3.id = courseCommentsRepository.create(comment3).id

    const response = await request(app).get('/courses/${course.id}/comments')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(comment1)
    expect(response.body).toContainEqual(comment2)
    expect(response.body).toContainEqual(comment3)

    courseRepository.delete(course.id)
    courseCommentsRepository.delete(comment1.id)
    courseCommentsRepository.delete(comment2.id)
    courseCommentsRepository.delete(comment3.id)
  })

  it('should create comment for certain course', async () => {
    const course = new Course()
    course.id = courseRepository.create(course).id
    const newComment = new Comment(course.id)

    const response = await request(app)
        .post('/courses/${course.id}/comments')
        .send(newComment)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.authorId).toBe(newComment.authorId)
    expect(response.body.courseId).toBe(newComment.courseId)
    expect(response.body.note).toBe(newComment.note)
    expect(response.body.createDate).toBe(newComment.createDate)

    courseRepository.delete(course.id)
    courseCommentsRepository.delete(newComment.id)
  })
})
