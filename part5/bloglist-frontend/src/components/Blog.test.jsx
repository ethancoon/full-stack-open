import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

describe('Testing blog rendering', () => {
  let mockLikeHandler
  let mockDeleteHandler
  let container

  beforeEach(() => {
    mockLikeHandler = vi.fn()
    mockDeleteHandler = vi.fn()
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 5,
    }

    container = render(
      <Blog blog={blog} handleLike={mockLikeHandler} handleDelete={mockDeleteHandler} />
    ).container
  })

  test('renders default view', () => {
    const detailedView = container.querySelector('.blogDetailedView')
    expect(detailedView).toHaveStyle('display: none')

    const defaultView = container.querySelector('.blogDefaultView')
    expect(defaultView).not.toHaveStyle('display: none')

    expect(container).toHaveTextContent('Component testing is done with react-testing-library Test Author')
    expect(within(defaultView).getByText('view')).toBeInTheDocument()

    expect(defaultView).not.toHaveTextContent('http://test.url')
    expect(defaultView).not.toHaveTextContent('likes 5')
  })

  test('renders detailed view after clicking the view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText("view")

    await user.click(button)

    const detailedView = container.querySelector('.blogDetailedView')
    expect(detailedView).not.toHaveStyle('display: none')

    const defaultView = container.querySelector('.blogDefaultView')
    expect(defaultView).toHaveStyle('display: none')

    expect(detailedView).toHaveTextContent('Component testing is done with react-testing-library Test Author')
    expect(detailedView).toHaveTextContent('http://test.url')
    expect(detailedView).toHaveTextContent('likes 5')
  })

  test('clicking the like button twice calls the event handler twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
