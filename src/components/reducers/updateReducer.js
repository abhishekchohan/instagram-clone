// this reducer just invert the state which we use to trigger useEffect to fetch new info at multiple place.
const updateReducer = (state = false, action) => {
    switch (action.type) {
        case 'update_data':
            return !state
        default:
            return state
    }
}

export default updateReducer;