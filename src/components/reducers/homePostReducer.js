const homePostReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_HPOSTS':
            return [...action.payload]
        case 'UPDATE_HPOSTS':
            return [action.payload, ...state]
        // case 'like':
        //     const a = { ...state, ...action.payload }
        //     const b = Object.values(a)
        //     console.log(b, action.payload);
        //     return b
        default:
            return state
    }
}

export default homePostReducer;