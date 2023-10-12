const mongoose = require('mongoose');

// Variation Schema
const variationSchema = mongoose.Schema({
    Variation_Name: {
        type: String,
        required: true,
    },
    Variation_Images: [{
        type: String
    }],
    Variation_Size: [{
        Size_Name: {
            type: String,
        },
        Size_Stock: {
            type: Number
        },
        R0_Price: {
            type: Number
        },
        R1_Price: {
            type: Number
        },
        R2_Price: {
            type: Number
        },
        R3_Price: {
            type: Number
        },
        R4_Price: {
            type: Number
        },
        Disc_Price: {
            type: Number
        },
        R1_Min_Quantity: {
            type: Number
        },
        R2_Min_Quantity: {
            type: Number
        },
        R3_Min_Quantity: {
            type: Number
        },
        R4_Min_Quantity: {
            type: Number
        },
        Size_Status: {
            type: Boolean,
            default: true
        },
    }],
    Variation_Status: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
    }
);


// Product Schema
const productSchema = mongoose.Schema({
    Product_Name: {
        type: String,
    },
    SKU_Code: {
        type: String,
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorys'
    },
    Sub_Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategorys'
    },
    Product_Image: {
        type: String
    },
    Product_Video: {
        type: String
    },
    Product_Youtube_Video: {
        type: String
    },
    Variation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variations',
    }],
    Price: {
        type: Number,
    },
    Product_Weight: {
        type: Number,
    },
    Product_Dimenstion: {
        type: String
    },
    Description: {
        type: String,
    },
    // Most_Sell: {
    //     type: Boolean,
    //     default: false
    // },
    // New_Arrival: {
    //     type: Boolean,
    //     default: false
    // },
    // All_Pro: {
    //     type: Boolean,
    //     default: false
    // },
    Features: {
        type: String,
        default: "None"
    },
    Product_Status: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Products', productSchema);
const Variation = mongoose.model('Variations', variationSchema);

module.exports = { Product, Variation };
