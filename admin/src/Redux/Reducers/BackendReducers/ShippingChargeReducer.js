const initialState = {
    payload: []
}


const ShippingChargeChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_SHIPPING_CHARGE":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default ShippingChargeChange