export const editSubCategory = (categoryId) => {
    return {
        type: "EDIT_SUB_CATEGORY",
        payload: {
            data: categoryId
        }
    }
}