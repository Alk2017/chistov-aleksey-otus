const request = require('supertest')
const express = require('express')
const random = require("../models/utils");
var {courseRouter} = require('./courses.js');
const {Course} = require("../models/course");
const {mongoose} = require("mongoose");
const {User} = require("../models/user");
const {clearCollections} = require("./testUtils");

const app = express()
app.use(express.json())
app.use('/courses', courseRouter);

mongoose.connect(
    'mongodb://localhost:27017/test_db?authSource=admin&directConnection=true'
).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

afterAll( () => {
  mongoose.disconnect();
})

describe('Course CRUD operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it('should create a new course', async () => {
    const author = await User.create(random.createRandomUser())
    const student = await User.create(random.createRandomUser())
    const course = random.createRandomCourse(author.id, [student])

    const response = await request(app)
      .post('/courses')
      .send(course)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe(course.name)
    expect(response.body.description).toBe(course.description)
    expect(response.body.authorId).toBe(course.authorId)
    expect(response.body.tags).toStrictEqual(course.tags)
    expect(response.body.difficulty).toBe(course.difficulty)
    expect(response.body.rating).toStrictEqual(course.rating)
    expect(response.body.lessons).toStrictEqual(course.lessons)
    expect(response.body.students).toStrictEqual(course.students.map((student) => student.id))
  })

  it('should get a course by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const student = await User.create(random.createRandomUser())
    // const lesson = await Lesson.create(random.createRandomLesson())
    const course = await Course.create(random.createRandomCourse(author.id, [student]))

    const response = await request(app).get(`/courses/${course.id}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(course.id)
    expect(response.body.name).toBe(course.name)
    expect(response.body.description).toBe(course.description)
    expect(response.body.authorId).toBe(course.authorId.toString())
    expect(response.body.tags).toStrictEqual(course.tags)
    expect(response.body.difficulty).toBe(course.difficulty)
    expect(response.body.rating).toStrictEqual(course.rating)
    expect(response.body.lessons).toStrictEqual(course.lessons)
    expect(response.body.students).toStrictEqual(course.students.map(student => student.id))
  })

  it('should update a course by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const student = await User.create(random.createRandomUser())
    const course = await Course.create(random.createRandomCourse(author.id, [student]))

    const authorNew = await User.create(random.createRandomUser())
    const studentNew = await User.create(random.createRandomUser())
    const courseNew = random.createRandomCourse(authorNew.id, [studentNew])

    const response = await request(app)
      .put(`/courses/${course.id}`)
      .send(courseNew)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(course.id)
    expect(response.body.name).toBe(courseNew.name)
    expect(response.body.description).toBe(courseNew.description)
    expect(response.body.authorId).toBe(courseNew.authorId)
    expect(response.body.tags).toStrictEqual(courseNew.tags)
    expect(response.body.difficult).toBe(courseNew.difficult)
    expect(response.body.rating).toStrictEqual(courseNew.rating)
    expect(response.body.lessons).toStrictEqual(courseNew.lessons)
    expect(response.body.students).toStrictEqual(courseNew.students.map(student => student.id))
  })

  it('should delete a course by ID', async () => {
    const author = await User.create(random.createRandomUser())
    const student = await User.create(random.createRandomUser())
    const course = await Course.create(random.createRandomCourse(author.id, [student]))

    const response = await request(app).delete(`/courses/${course.id}`)
    expect(response.status).toBe(204)

    const deletedCourse = await Course.findById(course.id)
    expect(deletedCourse).toBe(null)
  })

  it('should return 404 when trying to get a deleted course', async () => {
    const unexistCourse = new Course()
    const response = await request(app).get(`/courses/${unexistCourse.id}`)

    expect(response.status).toBe(404)
  })
})

describe('Courses operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it('should get all courses', async () => {
    const author1 = await User.create(random.createRandomUser())
    const student1 = await User.create(random.createRandomUser())
    const courseModel1 = random.createRandomCourse(author1.id, [student1])
    const course1 = await Course.create(courseModel1)
    const author2 = await User.create(random.createRandomUser())
    const student2 = await User.create(random.createRandomUser())
    const courseModel2 = random.createRandomCourse(author2.id, [student2])
    const course2 = await Course.create(courseModel2)
    const author3 = await User.create(random.createRandomUser())
    const student3 = await User.create(random.createRandomUser())
    const courseModel3 = random.createRandomCourse(author3.id, [student3])
    const course3 = await Course.create(courseModel3)

    const response = await request(app).get('/courses')

    courseModel1._id = course1.id
    courseModel1.students = courseModel1.students.map(student => student.id)
    courseModel2._id = course2.id
    courseModel2.students = courseModel2.students.map(student => student.id)
    courseModel3._id = course3.id
    courseModel3.students = courseModel3.students.map(student => student.id)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)
    expect(response.body).toContainEqual(courseModel1)
    expect(response.body).toContainEqual(courseModel2)
    expect(response.body).toContainEqual(courseModel3)
  })
})

describe('Course rating operations', () => {

  beforeAll( async () => {
    await clearCollections()
  })

  it.each([
    [[5], 5],
    [[1, 2, 5], 3],
    [[1, 2, 3], 2],
    [[1], 1],
    [[], 0],
  ])('should get a course rating(exist ratings: %p)', async (ratingArray, rating) => {
    const author = await User.create(random.createRandomUser())
    const courseModel = random.createRandomCourse(author.id)
    courseModel.rating = ratingArray
    const course = await Course.create(courseModel)

    const response = await request(app).get(`/courses/${course.id}/rating`)
    expect(response.status).toBe(200)
    expect(response.body.averageRating).toBe(rating)
  });

  it.each([
    [[], 5, [5]],
    [[1, 2, 4], 5, [1, 2, 4, 5]],
  ])('should update a course rating(exist ratings: %p), new value:%p', async (existRating, newRating, expectRating) => {
    const author = await User.create(random.createRandomUser())
    const courseModel = random.createRandomCourse(author.id)
    courseModel.rating = existRating
    const course = await Course.create(courseModel)

    const response = await request(app)
        .patch(`/courses/${course.id}/rating`)
        .send({ rating: newRating })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(course.id)
    expect(response.body.name).toBe(course.name)
    expect(response.body.email).toBe(course.email)
    expect(response.body.rating).toStrictEqual(expectRating)
  });
})

describe.skip('Course comments operations', () => {
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
