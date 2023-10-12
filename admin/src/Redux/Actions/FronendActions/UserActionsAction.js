export const editUser = (userId) => {
    return {
        type: "EDIT_USER",
        payload: {
            data: userId
        }
    }
}

export const showUserCart = (userId) => {
    return {
        type: "SHOW_USER_CART",
        payload: {
            data: userId
        }
    }
}