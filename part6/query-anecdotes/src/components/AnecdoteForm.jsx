import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdotes } from '../requests'
import { useDispatch, newNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdotes, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
    onError: (error) => {
      newNotification(dispatch, 'Failed to create anecdote, must have length 5 or more', 5)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    newNotification(dispatch, `new anecdote '${content}' created`, 5)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
