const notesRouter = require('express').Router()
const Blog = require('../models/blog') 


notesRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
  
notesRouter.post('/', async (request, response) => {
  const { title, author, ...body } = request.body

  if (!title || !author) {
    return response.status(400).json({ error: 'title or author missing' })
  }
  
  const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = notesRouter