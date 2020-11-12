// set_hposts will set new data however update_hposts will update data in store.
const homePostReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_HPOSTS':
            return [...action.payload]
        case 'UPDATE_HPOSTS':
            return [action.payload, ...state]
        default:
            return state
    }
}

export default homePostReducer;