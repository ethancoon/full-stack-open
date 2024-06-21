import { useState } from 'react'

const Blog = ({ blog }) => {
  const [detailed, setDetailed] = useState(false)

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
        <button>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog