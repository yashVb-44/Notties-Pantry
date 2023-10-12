const mongoose = require('mongoose');

const NotiflySchema = mongoose.Schema(
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

module.exports = mongoose.model('Notifly', NotiflySchema);
