const loggedReducer = (state = null, action) => {
    switch (action.type) {
        case 'set_logged_true':
            return true
        case 'set_logged_false':
            return false
        default:
            return state
    }
}

export default loggedReducer;