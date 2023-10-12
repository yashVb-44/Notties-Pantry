export const editNottifly = (nottiflyId) => {
    return {
        type: "EDIT_NOTTIFLY",
        payload: {
            data: nottiflyId
        }
    }
}