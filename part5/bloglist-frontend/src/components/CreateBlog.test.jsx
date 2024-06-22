import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'
import { expect, test } from 'vitest'

describe('Testing blog submission', () => {
  let mockCreateHandler
  let container

  beforeEach(() => {
    mockCreateHandler = vi.fn()

    container = render(
      <CreateBlog handleCreate={mockCreateHandler} />
    ).container
  })

  test('submitting a blog calls the event handler with the correct details', async () => {
    const user = userEvent.setup()
    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submitButton = screen.getByRole('button')

    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.url')

    await user.click(submitButton)

    expect(mockCreateHandler).toHaveBeenCalledTimes(1)
    expect(mockCreateHandler).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 0
    })
  })
})