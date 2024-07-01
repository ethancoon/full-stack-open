import { createContext, useReducer, useContext } from 'react';


const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.data;
        case 'REMOVE_NOTIFICATION':
            return null;
        default:
            return state;
    }
}

const notificationContext = createContext();

export const NotificationContextProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, null);

    return (
        <notificationContext.Provider value={[ notification, dispatch ]}>
            {props.children}
        </notificationContext.Provider>
    );
}

export const useNotification = () => {
    const notificationAndDispatch = useContext(notificationContext);
    return notificationAndDispatch[0];
}

export const useDispatch = () => {
    const notificationAndDispatch = useContext(notificationContext);
    return notificationAndDispatch[1];
}

export const newNotification = (dispatch, message, timeout) => {
    dispatch({ type: 'SET_NOTIFICATION', data: message });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION' }), timeout * 1000);
}

export default notificationContext;