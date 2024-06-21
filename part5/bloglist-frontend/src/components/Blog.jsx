import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
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

  
  return (
    <div style={blogStyle}>
      <div style={showWhenNotDetailed}>
        {blog.title} {blog.author}
        <button onClick={toggleDetailed}>view</button>
      </div>
      <div style={showWhenDetailed}>
        {blog.title} {blog.author}
        <button onClick={toggleDetailed}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes}
        <button onClick={increaseLikes}>like</button>
        <br />
        {blog.user?.name || postedBy}
      </div>
    </div>
  )
}

export default Blog