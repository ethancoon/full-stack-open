const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./helper')

const api = supertest(app)


describe('testing blog api', () => {
    beforeEach(async () => {
		await Blog.deleteMany({});
		const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
		const promiseArray = blogObjects.map(blog => blog.save());
		await Promise.all(promiseArray);

        await User.deleteMany({});   
	});

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(e => e.title)
        assert(titles.includes('Canonical string reduction'))
    })

    test('verifies that the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        assert(response.body[0].id)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'CSS is hard',
            author: 'Me',
            url: 'www.me.com',
            likes: 0
        }

        const user = await api
        .post('/api/users')
        .send({
            username: 'testuser',
            name: 'Test User',
            password: 'password'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const token = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)     

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        const titles = response.body.map(e => e.title)
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        assert(titles.includes('CSS is hard'))
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const newBlog = {
            title: 'Java is easy',
            author: 'Me',
            url: 'www.me.com'
        }

        const user = await api
        .post('/api/users')
        .send({
            username: 'testuser',
            name: 'Test User',
            password: 'password'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const token = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)     

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
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

        const user = await api
        .post('/api/users')
        .send({
            username: 'testuser',
            name: 'Test User',
            password: 'password'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const token = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)     

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(400)

        const newBlog2 = {
            title: 'Java is easy',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog2)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(400)
    })

    test('deleting a blog post', async () => {
        const user = await api
            .post('/api/users')
            .send({ username: 'Deleter', password: '1234' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login/')
            .send({ username: user.body.username, password: '1234' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const createdBlog = await api
            .post('/api/blogs')
            .send({ title: 'to delete', author: 'to delete', url: 'www.delete.com', likes: 1, user: user.body.id})
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogToDelete = createdBlog.body
        const blogsAfterCreating = await helper.blogsInDB()

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(204)

        const response2 = await helper.blogsInDB()
        const titles = response2.map(e => e.title)
        assert(!titles.includes('to delete'))
    })

    test('delete a blog post with an invalid id', async () => {
        const user = await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'password'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)     
        
        await api
            .delete('/api/blogs/123')
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(400)
    })

    test('delete a blog post without a token', async () => {
        const user = await api
            .post('/api/users')
            .send({ username: 'Deleter', password: '1234' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login/')
            .send({ username: user.body.username, password: '1234' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const createdBlog = await api
            .post('/api/blogs')
            .send({ title: 'to delete', author: 'to delete', url: 'www.delete.com', likes: 1, user: user.body.id})
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogToDelete = createdBlog.body
        const blogsAfterCreating = await helper.blogsInDB()

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })



    test('updating a blog post', async () => {
        const response = await api.get('/api/blogs')
        const blogToUpdate = response.body[0]

        const updatedBlog = {
            title: 'HTML is hard',
            author: 'John Doe',
            url: 'www.johndoe.com',
            likes: 5
        }

        const user = await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'password'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)     

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const response2 = await api.get('/api/blogs')
        const titles = response2.body.map(e => e.title)
        assert(titles.includes('HTML is hard'))
    })

    test('updating a blog post without including required param title', async () => {
        const updatedBlog = {
            author: 'John Doe',
            url: 'www.johndoe.com',
            likes: 5
        }

        const user = await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'password'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)     

        await api
            .put(`/api/blogs/${helper.initialBlogs[0].id}`)
            .send(updatedBlog)
            .set({ 'Authorization': `bearer ${token.body.token}`, Accept: 'application/json' })
            .expect(400)
    })

    test('updating a blog post without including required param author', async () => {
        const updatedBlog = {
            title: 'HTML is hard',
            url: 'www.johndoe.com',
            likes: 5
        }

        const user = await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'password'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)     

        await api
            .put(`/api/blogs/${helper.initialBlogs[0].id}`)
            .send(updatedBlog)
            .expect(400)
    })

    test('updating a blog post with an invalid id', async () => {
        const updatedBlog = {
            title: 'HTML is hard',
            author: 'John Doe',
            url: 'www.johndoe.com',
            likes: 5
        }

        const user = await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'password'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const token = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)     

        await api
            .put('/api/blogs/123')
            .send(updatedBlog)
            .expect(400)
    })

})

describe('testing users api', () => {
    beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash("spt", 10);
		const user = new User({
			username: "shturman",
			name: "John Shturman",
			passwordHash,
		});

		await user.save();
	});


    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all users are returned', async () => {
        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, 1)
    })

    test('a specific user is within the returned users', async () => {
        const response = await api.get('/api/users')
        const usernames = response.body.map(e => e.username)
        assert(usernames.includes('shturman'))
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/users')
        const usernames = response.body.map(e => e.username)
        assert(usernames.includes('newuser'))
        assert.strictEqual(response.body.length, 2)
    })

    test('if the password or username properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
        const newUser = {
            name: 'New User',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const newUser2 = {
            username: 'newuser',
            name: 'New User'
        }

        await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
    })

    test('if the password or username properties are less than 3 characters long, the backend responds to the request with the status code 400 Bad Request', async () => {
        const newUser = {
            username: 'ne',
            name: 'New User',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const newUser2 = {
            username: 'newuser',
            name: 'New User',
            password: 'pa'
        }

        await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
    })
})
    

after(async () => {
  await mongoose.connection.close()
})