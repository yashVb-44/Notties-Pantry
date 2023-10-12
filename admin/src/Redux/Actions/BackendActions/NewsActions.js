export const editNews = (newsId) => {
    return {
        type: "EDIT_NEWS",
        payload: {
            data: newsId
        }
    }
}