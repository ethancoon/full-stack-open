import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setMessage({
        content: `Successfully logged in as ${user.name}`,
        type: 'info'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)

    } catch (exception) {
      console.log(exception)
      setMessage({
        content: 'Wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreate = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const title = blogObject.title
      const author = blogObject.author
      const url = blogObject.url
      const likes = blogObject.likes
      const newBlog = await blogService.create({
        title, author, url, likes, user: user.id
      })
      setBlogs(blogs.concat(newBlog))
      setMessage({
        content: `A new blog ${newBlog.title} by author ${newBlog.author} added by user ${user.name}`,
        type: 'info'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage({
        content: 'Error deleting blog',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    }
  }

  const handleLike = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
    } catch (exception) {
      console.log(exception)
      setMessage({
        content: 'Error deleting blog',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (exception) {
      console.log(exception)
      setMessage({
        content: 'Error deleting blog',
        type: 'error'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    }
  }

  if (user !== null) {
    return (
      <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <Notification message={message.content} messageType={message.type} />

        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <h2>create new</h2>
          <CreateBlog
            handleCreate={handleCreate}
          />
        </Togglable>

        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} username={user.username} blog={blog} handleLike={handleLike} handleDelete={handleDelete}/>
          )}
      </div>
    )
  } else {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message.content} messageType={message.type} />

        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }
}

export default App