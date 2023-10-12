const mongoose = require('mongoose');

const SubCategorySchema = mongoose.Schema(
    {
        subCategoryName: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorys'
        },
        subCategoryStatus: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SubCategorys', SubCategorySchema);
