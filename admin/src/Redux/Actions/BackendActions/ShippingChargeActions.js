export const editShippingCharge = (shippingId) => {
    return {
        type: "EDIT_SHIPPING_CHARGE",
        payload: {
            data: shippingId
        }
    }
}