// Here we set the details of logged user to state or delete it to logout them from system
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