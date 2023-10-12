const mongoose = require('mongoose');

const NotiflyMeSchema = mongoose.Schema(
    {
        // notiflyTitle: {
        //     type: String,
        // },
        fileType: {
            type: String,
        },
        fileUrl: {
            type: String,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        desc: {
            type: String
        },
        notiflyStatus: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('NotiflyMe', NotiflyMeSchema);
