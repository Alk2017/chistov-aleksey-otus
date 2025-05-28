var express = require('express');
const {Lesson} = require("../models/lesson");
const {handleError} = require("./utils");
const {LessonComment} = require("../models/lessonComment");
const {User} = require("../models/user");
var lessonRouter = express.Router();

// Get all lessones
lessonRouter.get('/', async function (req, res, next) {
    const lesson = await Lesson.find()
    res.status(200).json(lesson)
});

// Get certain lesson
lessonRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const lesson = await Lesson.findById(id)
    if (lesson) {
        res.json(lesson)
    } else {
        return res.status(404).json({message: 'Lesson with id:' + id + ' not found'})
    }
});

// Create lesson
lessonRouter.post('/', async function (req, res, next) {
    try {
        const lessonDate = req.body;
        if (!lessonDate || !lessonDate.name || !lessonDate.authorId) {
            res.status(400).json({message: '`name` and `authorId` fields is required!'});
        } else {
            const lesson = new Lesson(lessonDate);
            await lesson.save();
            res.status(201).json(lesson);
        }
    } catch (err) {
        handleError(err, 'Lesson create server error', res)
    }
})

// Update a lesson
lessonRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const lessonData = req.body;
        const updatedLesson = await Lesson.findByIdAndUpdate(
            id,
            lessonData,
            {new: true}
        );
        if (!updatedLesson) {
            return res.status(404).json({message: 'Lesson not found'});
        }
        res.status(200).json(updatedLesson);
    } catch (err) {
        handleError(err, 'Lesson update server error', res)
    }
})

// Delete a lesson
lessonRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const lesson = await Lesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({message: 'Lesson not found'});
        }
        res.status(204).json({message: 'Lesson deleted successfully'});
    } catch (err) {
        handleError(err, 'Lesson delete server error', res)
    }
})

// Get a lesson rating
lessonRouter.get('/:id/rating', async (req, res) => {
    const lesson = await Lesson.findById(req.params.id)
    if (lesson) {
        const averageRating = Math.round(lesson.rating.reduce((sum, currentValue) => sum + currentValue, 0) / lesson.rating.length)
        res.json({
            averageRating: averageRating ? averageRating : 0,
        })
    } else {
        return res.status(404).json({message: 'Lesson not found'})
    }
})

// Update a lesson rating
lessonRouter.patch('/:id/rating', async (req, res) => {
    const rating = req.body.rating
    if (!rating) {
        res.status(400).json({message: '`rating` field is required!'});
    } else if (rating > 5 || rating < 1) {
        res.status(400).json({message: '`rating` can be in range 1-5!'});
    } else {
        try {
            const id = req.params.id
            const lessonData = await Lesson.findById(req.params.id)
            lessonData.rating.push(rating)
            const updatedLesson = await Lesson.findByIdAndUpdate(
                id,
                lessonData,
                {new: true}
            )
            if (!updatedLesson) {
                return res.status(404).json({message: 'Lesson not found'});
            }
            res.status(200).json(updatedLesson);
        } catch (err) {
            handleError(err, 'Lesson rating update server error', res)
        }
    }
})

// Get certain lesson comments
lessonRouter.get('/:id/comments', async (req, res) => {
    const comments = await LessonComment.find({lessonId: req.params.id})
    res.status(200).json(comments)
});

// Create certain lesson comment
lessonRouter.post('/:id/comments', async (req, res) => {
    try {
        const commentDate = req.body;
        const user = await User.findOne({name: commentDate.username})
        if (!commentDate || !commentDate.comment) {
            res.status(400).json({message: '`comment` fields is required!'});
        } else if (!user) {
            res.status(400).json({message: `user with name: ${commentDate.username} not found!`});
        } else {
            commentDate.authorId = user._id
            commentDate.lessonId = req.params.id
            const comment = new LessonComment(commentDate);
            await comment.save();
            res.status(201).json(comment);
        }
    } catch (err) {
        handleError(err, 'Lesson create server error', res)
    }
});

module.exports = {lessonRouter}
