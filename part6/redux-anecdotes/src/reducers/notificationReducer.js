import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload;
        },
        clearNotification(state) {
            return '';
        },
    },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const newNotification = (message, timeout) => {
    return dispatch => {
        dispatch(setNotification(message));
        setTimeout(() => {
            dispatch(clearNotification());
        }, timeout * 1000);
    };
}

export default notificationSlice.reducer;