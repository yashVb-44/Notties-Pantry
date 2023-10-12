const initialState = {
    payload: []
}


const SubCategoryDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_SUB_CATEGORY":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default SubCategoryDataChange