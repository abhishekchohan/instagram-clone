const loadedReducer = (state = false, action) => {
    switch (action.type) {
        case 'UPDATE_LOAD':
            state = true;
            return state
        default:
            return state
    }
}

export default loadedReducer;