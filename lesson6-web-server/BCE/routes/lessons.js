var express = require('express');
// const {Lesson, LessonRepository} = require("../models/lesson");
var lessonRouter = express.Router();

// var lessonRepository = new LessonRepository();
// var lessonCommentsRepository = new LessonCommentsRepository();

// Get all lessones
lessonRouter.get('/', function(req, res, next) {
    // pass
});

// Get certain lesson
lessonRouter.get('/:id', (req, res) => {
    // pass
});

// Create lesson
lessonRouter.post('/', function(req, res, next) {
    // pass
})

// Update a lesson
lessonRouter.put('/:id', (req, res) => {
    // pass
})

// Delete a lesson
lessonRouter.delete('/:id', (req, res) => {
    // pass
})

// Get a lesson rating
lessonRouter.get('/:id/rating', (req, res) => {
    // pass
})

// Update a lesson rating
lessonRouter.patch('/:id/rating', (req, res) => {
    // pass
})

// Get certain lesson comments
lessonRouter.get('/:id/comments', (req, res) => {
    // pass
});

// Create certain lesson comment
lessonRouter.post('/:id/comments', (req, res) => {
// pass
});

// module.exports = {lessonRouter, lessonRepository, lessonCommentsRepository}
module.exports = {lessonRouter}
