const initialState = {
    payload: []
}


const NottiflyDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_NOTTIFLY":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default  NottiflyDataChange 