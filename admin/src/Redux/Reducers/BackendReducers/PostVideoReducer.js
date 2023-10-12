const initialState = {
    payload: []
}


const VideoDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_VIDEO":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default  VideoDataChange 