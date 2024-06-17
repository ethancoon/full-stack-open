const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'www.johndoe.com',
    likes: 5
    },
    {
    title: 'CSS is easy',
    author: 'Jane Doe',
    url: 'www.janedoe.com',
    likes: 10
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})
  


describe('api methods', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(e => e.title)
        assert(titles.includes('HTML is easy'))
    })

    test('verifies that the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        assert(response.body[0].id)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'React patterns',
            author: 'Me',
            url: 'www.me.com',
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const titles = response.body.map(e => e.title)
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert(titles.includes('React patterns'))
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const newBlog = {
            title: 'Java is easy',
            author: 'Me',
            url: 'www.me.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const likes = response.body.map(e => e.likes)
        assert(likes.includes(0))
    })

    test('if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
        const newBlog = {
            author: 'Me',
            url: 'www.me.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const newBlog2 = {
            title: 'Java is easy',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog2)
            .expect(400)
    })
})

after(async () => {
  await mongoose.connection.close()
})