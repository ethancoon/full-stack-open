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

  const initBlog = {
    title: '',
    author: '',
    url: ''
  }

  const [blog, setBlog] = useState(initBlog)

  const blogFormRef = useRef()


  useEffect(() => {
		blogService.getAll().then(blogs => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);


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
        content: `Wrong credentials`,
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

  const handleCreate = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    try {
      const title = blog.title
      const author = blog.author
      const url = blog.url
      const newBlog = await blogService.create({
        title, author, url
      })
      setBlogs(blogs.concat(newBlog))
      setBlog(initBlog)
      setMessage({
        content: `A new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'info'
      })
      setTimeout(() => {
        setMessage({})
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage({
        content: `Error creating blog`,
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
            blog={blog}
            setBlog={setBlog}
          />
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  } else {
    return (
      <div>
        <h2>Log in to application</h2>

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