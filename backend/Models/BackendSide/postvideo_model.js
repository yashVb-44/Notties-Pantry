const mongoose = require('mongoose')

const PostVideoSchema = mongoose.Schema({

    post_video_Name: {
        type: String,
    },
    post_video_Status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
    }

)

module.exports = mongoose.model('PostVideo', PostVideoSchema)