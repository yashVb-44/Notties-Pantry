export const editVideo = (videoId) => {
    return {
        type: "EDIT_VIDEO",
        payload: {
            data: videoId
        }
    }
}