const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
        },
        categoryImage: {
            type: String
        },
        categoryStatus: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Categorys', CategorySchema);
