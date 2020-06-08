const loggedReducer = (state = false, action) => {
    switch (action.type) {
        case 'UPDATE_LOG':
            return !state
        default:
            return state
    }
}

export default loggedReducer;