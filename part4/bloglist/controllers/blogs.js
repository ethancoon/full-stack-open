const blogsRouter = require('express').Router()
const Blog = require('../models/blog') 
const User = require('../models/user')
const { userExtractor } = require("../utils/middleware");


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, ...body } = request.body

  const user = request.user

  if (!title || !author) {
    return response.status(400).json({ error: 'title or author missing' })
  }
  
  const blog = new Blog({
        title: title,
        author: author,
        url: body.url,
        likes: body.likes,
        user: user.id
  })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if(!blog) {
        return response.status(400).json({ error: 'invalid id' })
    }

    const user = request.user

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'unauthorized to delete' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, ...body } = request.body

    if (!title || !author) {
        return response.status(400).json({ error: 'title or author missing' })
    }

    const blog = {
        title: title,
        author: author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog).status(200)
})

module.exports = blogsRouter