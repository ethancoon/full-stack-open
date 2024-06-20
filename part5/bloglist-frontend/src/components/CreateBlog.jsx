const CreateBlog = ({ handleCreate, blog, setBlog }) => {
    return (
        <form onSubmit={handleCreate}>
          <div>
            title:
              <input
              type="text"
              value={blog.title}
              name="Title"
              onChange={({ target }) => setBlog(prev => ({ ...prev, title: target.value }))}
              />
          </div>
          <div>
            author:
              <input
              type="text"
              value={blog.author}
              name="Author"
              onChange={({ target }) => setBlog(prev => ({ ...prev, author: target.value }))}
              />
          </div>
          <div>
            url:
              <input
              type="text"
              value={blog.url}
              name="url"
              onChange={({ target }) => setBlog(prev => ({ ...prev, url: target.value }))}
              />
          </div>
          <button type="submit">create</button>
        </form>

    )
}

export default CreateBlog