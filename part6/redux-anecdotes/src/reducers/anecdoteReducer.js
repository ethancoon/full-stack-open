import { createSlice } from '@reduxjs/toolkit';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createVote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find(a => a.id === id);
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };
      return state.map(a => a.id !== id ? a : votedAnecdote);
    },
    createAnecdote(state, action) {
      state.push({
        content: action.payload.content,
        id: action.payload.id,
        votes: 0,
      });
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  }, 
});

export const { createVote, createAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;