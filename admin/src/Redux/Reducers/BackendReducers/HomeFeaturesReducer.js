const initialState = {
    payload: []
}


const HomeFeatureDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_HOME_FEATURES":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default  HomeFeatureDataChange 