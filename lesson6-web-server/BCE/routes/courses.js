var express = require('express');
const {Course} = require("../models/course");
const {handleError} = require("./utils");
const {User} = require("../models/user");
var courseRouter = express.Router();

// var courseRepository = new CourseRepository();
// var courseCommentsRepository = new CourseCommentsRepository();

// Get all courses
courseRouter.get('/', async function (req, res, next) {
    const courses = await Course.find()
    res.status(200).json(courses)
});

// Get certain course
courseRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const course = await Course.findById(id)
    if (course) {
        res.json(course)
    } else {
        return res.status(404).json({message: 'Course with id:' + id + ' not found'})
    }
});

// Create course
courseRouter.post('/', async function (req, res, next) {
    try {
        const courseDate = req.body;
        if (!courseDate || !courseDate.name || !courseDate.authorId) {
            res.status(400).json({message: '`name` and `authorId` fields is required!'});
        } else {
            const course = new Course(courseDate);
            await course.save();
            res.status(201).json(course);
        }
    } catch (err) {
        handleError(err, 'Course create server error', res)
    }

})

// Update a course
courseRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const courseData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            courseData,
            {new: true}
        );
        if (!updatedCourse) {
            return res.status(404).json({message: 'Course not found'});
        }
        res.status(200).json(updatedCourse);
    } catch (err) {
        handleError(err, 'Course update server error', res)
    }
})

// Delete a course
courseRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        res.status(204).json({message: 'Course deleted successfully'});
    } catch (err) {
        handleError(err, 'Course delete server error', res)
    }
})

// Get a course rating
courseRouter.get('/:id/rating', async (req, res) => {
    const course = await Course.findById(req.params.id)
    if (course) {
        const averageRating = Math.round(course.rating.reduce((sum, currentValue) => sum + currentValue, 0) / course.rating.length)
        res.json({
            averageRating: averageRating ? averageRating : 0,
        })
    } else {
        return res.status(404).json({message: 'Course not found'})
    }
})

// Update a course rating
courseRouter.patch('/:id/rating', async (req, res) => {
    const rating = req.body.rating
    if (!rating) {
        res.status(400).json({message: '`rating` field is required!'});
    } else if (rating > 5 || rating < 1) {
        res.status(400).json({message: '`rating` can be in range 1-5!'});
    } else {
        try {
            const id = req.params.id
            const courseData = await Course.findById(req.params.id)
            courseData.rating.push(rating)
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                courseData,
                {new: true}
            )
            if (!updatedCourse) {
                return res.status(404).json({message: 'Course not found'});
            }
            res.status(200).json(updatedCourse);
        } catch (err) {
            handleError(err, 'Course rating update server error', res)
        }
    }
})

// Get certain course comments
courseRouter.get('/:id/comments', (req, res) => {
    // pass
});

// Create certain course comment
courseRouter.post('/:id/comments', (req, res) => {
// pass
});

// module.exports = {courseRouter, courseRepository, courseCommentsRepository}
module.exports = {courseRouter}
