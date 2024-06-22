import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [detailed, setDetailed] = useState(false)
  const [postedBy, setPostedBy] = useState('')

  const showWhenDetailed = { display: detailed ? '' : 'none' }
  const showWhenNotDetailed = { display: detailed ? 'none' : '' }

  const toggleDetailed = () => {
    setDetailed(!detailed)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const increaseLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    setPostedBy(postedBy || blog.user?.name)

    handleLike(blog.id, updatedBlog)
  }

  const removeBlog = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={showWhenNotDetailed} className="blogDefaultView">
        {blog.title} {blog.author}
        <button onClick={toggleDetailed}>view</button>
      </div>
      <div style={showWhenDetailed} className="blogDetailedView">
        {blog.title} {blog.author}
        <button onClick={toggleDetailed}>hide</button>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={increaseLikes}>like</button></p>
        {blog.user?.name || postedBy}
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}

export default Blog