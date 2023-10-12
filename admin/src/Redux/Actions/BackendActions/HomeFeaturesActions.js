export const editHomeFeature = (homeFeaturesId) => {
    return {
        type: "EDIT_HOME_FEATURES",
        payload: {
            data: homeFeaturesId
        }
    }
}