const updateReducer = (state = false, action) => {
    switch (action.type) {
        case 'update_data':
            return !state
        default:
            return state
    }
}

export default updateReducer;