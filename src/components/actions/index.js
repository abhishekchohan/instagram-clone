export const set_islogged = () => {
    return {
        type: 'UPDATE_LOG'
    }
}

export const set_isLoaded = () => {
    return {
        type: 'UPDATE_LOAD'
    }
}

export const set_hPosts = (data) => {
    return {
        type: 'SET_HPOSTS',
        payload: data
    }
}

export const update_hPosts = (data) => {
    return {
        type: 'UPDATE_HPOSTS',
        payload: data
    }
}