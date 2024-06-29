import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import noteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await noteService.createNew(content)
        dispatch(createAnecdote({
            content: newAnecdote.content,
            id: newAnecdote.id,
            votes: newAnecdote.votes
        }))
        dispatch(setNotification(`You created '${content}'`))
        setTimeout(() => {
            dispatch(clearNotification());
          }, 5000)
      }
    
    return (
        <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name="anecdote"/></div>
            <button>create</button>
        </form>
        </div>
    )
}

export default AnecdoteForm