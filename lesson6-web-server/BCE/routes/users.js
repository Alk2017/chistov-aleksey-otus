var express = require('express');
const {User, UserRepository} = require("../models/user");
var userRouter = express.Router();

var userRepository = new UserRepository();

userRouter.get('/', function(req, res, next) {
  res.json(userRepository.getAll())
});

userRouter.get('/:id', (req, res) => {
  const user = userRepository.getById(parseInt(req.params.id))
  if (user) {
    res.json(user)
  } else {
    res.status(404).send('User not found')
  }
});

userRouter.post('/', function(req, res, next) {
  const newUser = new User(null, req.body.name, req.body.email)
  const createdUser = userRepository.create(newUser)
  res.status(201).json(createdUser)
})

// Update a user
userRouter.put('/:id', (req, res) => {
  const updatedUser = { name: req.body.name, email: req.body.email, rating: req.body.rating }
  const user = userRepository.update(parseInt(req.params.id), updatedUser)
  if (user) {
    res.json(user)
  } else {
    res.status(404).send('User not found')
  }
})

// Delete a user
userRouter.delete('/:id', (req, res) => {
  const user = userRepository.delete(parseInt(req.params.id))
  if (user) {
    res.status(204).send()
  } else {
    res.status(404).send('User not found')
  }
})

// Get a user rating
userRouter.get('/:id/rating', (req, res) => {
  // pass
})

// Update a user rating
userRouter.patch('/:id/rating', (req, res) => {
  const rating = req.body.rating
  const user = userRepository.rating(parseInt(req.params.id), rating)
  if (user) {
    res.json(user)
  } else {
    res.status(404).send('User not found')
  }
})

module.exports = {userRouter, userRepository}
