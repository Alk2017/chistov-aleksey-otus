var express = require('express');
// const {Course, CourseRepository} = require("../models/course");
var courseRouter = express.Router();

// var courseRepository = new CourseRepository();
// var courseCommentsRepository = new CourseCommentsRepository();

// Get all courses
courseRouter.get('/', function(req, res, next) {
    // pass
});

// Get certain course
courseRouter.get('/:id', (req, res) => {
    // pass
});

// Create course
courseRouter.post('/', function(req, res, next) {
    // pass
})

// Update a course
courseRouter.put('/:id', (req, res) => {
    // pass
})

// Delete a course
courseRouter.delete('/:id', (req, res) => {
    // pass
})

// Get a course rating
courseRouter.get('/:id/rating', (req, res) => {
    // pass
})

// Update a course rating
courseRouter.patch('/:id/rating', (req, res) => {
    // pass
})

// Get certain course comments
courseRouter.get('/:id/comments', (req, res) => {
    // pass
});

// Create certain course comment
courseRouter.post('/:id/comments', (req, res) => {
// pass
});

module.exports = {courseRouter, courseRepository, courseCommentsRepository}
