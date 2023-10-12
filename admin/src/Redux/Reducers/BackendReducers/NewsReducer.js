const initialState = {
    payload: []
}


const NewsDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_NEWS":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default NewsDataChange