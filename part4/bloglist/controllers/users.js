const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const exisitingUser = await User.findOne({ username });

  if (exisitingUser) {
    return response.status(400).json({ error: 'username already exists' })
  }

  if (!password || password.length < 3|| !username || username.length < 3) {
    return response.status(400).json({ error: 'password or username is missing or too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter