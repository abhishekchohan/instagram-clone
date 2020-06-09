const loggedUserReducer = (state = null, action) => {
    switch (action.type) {
        case 'set_loggedUser':
            return action.payload
        case 'unset_loggedUser':
            return null
        default:
            return state
    }
}

export default loggedUserReducer;