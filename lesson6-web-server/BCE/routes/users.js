var express = require('express');
const {User} = require("../models/user");
const {handleError} = require("./utils");
var userRouter = express.Router();

userRouter.get('/', async function (req, res, next) {
  const users = await User.find()
  res.status(200).json(users)
});

userRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id)
    if (user) {
      res.json(user)
    } else {
      return res.status(404).json({ message: 'User with id:'+id+' not found'})
    }
  } catch (err) {
    handleError(err, 'User get server error', res)
  }

});

userRouter.post('/', async function (req, res, next) {
  try {
    const userData = req.body;
    if (!userData || !userData.name || !userData.email) {
      res.status(400).json({message: '`name` and `email` fields is required!'});
    } else {
      const user = new User(userData);
      await user.save();
      res.status(201).json(user);
    }
  } catch (err) {
    handleError(err, 'User create server error', res)
  }

})

// Update a user
userRouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        userData,
        { new: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    handleError(err, 'User update server error', res)
  }
})

// Delete a user
userRouter.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (err) {
    handleError(err, 'User delete server error', res)
  }
})

// Get a user rating
userRouter.get('/:id/rating', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      const averageRating = Math.round(user.rating.reduce((sum, currentValue) => sum + currentValue, 0) / user.rating.length)
      res.json({
        averageRating:averageRating ? averageRating : 0,
      })
    } else {
      return res.status(404).json({message: 'User not found'})
    }
  } catch (err) {
    handleError(err, 'User rating get server error', res)
  }
})

// Update a user rating
userRouter.patch('/:id/rating', async (req, res) => {
  const rating = req.body.rating
  if (!rating) {
    res.status(400).json({message: '`rating` field is required!'});
  } else if (rating > 5 || rating < 1) {
    res.status(400).json({message: '`rating` can be in range 1-5!'});
  } else {
    try {
      const id = req.params.id;
      const userData = await User.findById(req.params.id)
      userData.rating.push(rating)
      const updatedUser = await User.findByIdAndUpdate(
          id,
          userData,
          {new: true}
      )
      if (!updatedUser) {
        return res.status(404).json({message: 'User not found'});
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      handleError(err, 'User rating update server error', res)
    }
  }
})

module.exports = {userRouter}
