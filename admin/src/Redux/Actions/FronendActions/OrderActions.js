export const editOrder = (orderId) => {
    return {
        type: "EDIT_ORDER",
        payload: {
            data: orderId
        }
    }
}

export const orderTrackId = (orderId) => {
    return {
        type: "ORDER_TRACK_ID",
        payload: {
            data: orderId
        }
    }
}