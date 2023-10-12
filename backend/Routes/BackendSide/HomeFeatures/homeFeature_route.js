const express = require('express')
const route = express.Router()
const HomeFeatures = require('../../../Models/BackendSide/home_features_model')
const { Product, Variation } = require('../../../Models/BackendSide/product_model')
const User = require('../../../Models/FrontendSide/user_model')
const Wishlist = require('../../../Models/FrontendSide/wish_list_model');
const Review = require('../../../Models/FrontendSide/review_model')
const fs = require('fs');


// Create HomeFeatures
route.post('/add', async (req, res) => {
    try {
        const { name } = req.body;

        const homeFeatures = new HomeFeatures({
            name: name,
        });

        await homeFeatures.save();
        res.status(200).json({ type: "success", message: "HomeFeatures added successfully!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all HomeFeatures 
route.get('/get', async (req, res) => {
    try {
        const homeFeatures = await HomeFeatures.find().sort({ createdAt: -1 });
        let result = []

        if (homeFeatures?.length > 0) {
            result = homeFeatures?.map(feature => {
                return {
                    ...feature.toObject(),
                    // Date: new Date(video?.createdAt)?.toLocaleDateString('en-IN'),
                }
            })
        }

        const enablehomeFeatures = await HomeFeatures.find({ status: true }).sort({ createdAt: -1 });

        res.status(200).json({ type: "success", message: " HomeFeatures found successfully!", homeFeatures: result || [], enablehomeFeatures: enablehomeFeatures || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// find HomeFeatures by id
route.get('/get/:id', async (req, res) => {
    const { id } = req.params
    try {
        const homeFeatures = await PostVideo.findOne({ _id: id });
        res.status(201).json({ type: "success", message: " HomeFeatures found successfully!", homeFeatures: homeFeatures })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// find HomeFeatures by id
route.get('/mob/get', async (req, res) => {
    try {
        const homeFeatures = await HomeFeatures.find({ status: true });
        res.status(201).json({ type: "success", message: " PostVideo found successfully!", homeFeatures: homeFeatures || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all HomeFeatures
route.delete('/delete', async (req, res) => {
    try {
        await HomeFeatures.deleteMany();
        res.status(200).json({ type: "success", message: "All HomeFeatures deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete many HomeFeatures
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const homeFeatures = await HomeFeatures.find({ _id: { $in: ids } });
        await HomeFeatures.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All HomeFeatures deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete data by ID
route.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await HomeFeatures.findByIdAndDelete(id);
        res.status(200).json({ type: "success", message: "HomeFeatures deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const id = await req.params.id

    try {
        const { status } = req.body
        const homeFeatures = await HomeFeatures.findByIdAndUpdate(id)
        homeFeatures.status = await status

        await homeFeatures.save()
        res.status(200).json({ type: "success", message: "HomeFeatures Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update data
route.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const homeFeatures = await HomeFeatures.findById(id);
        if (!homeFeatures) {
            return res.status(404).json({ type: "warning", message: "HomeFeatures does not exist!" });
        }

        homeFeatures.name = name

        await homeFeatures.save();
        res.status(200).json({ type: "success", message: "HomeFeatures updated successfully!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


// get wishlist from wishlist Model
const getWishList = async (userId) => {
    try {
        if (userId != "0") {
            const wishList = await Wishlist.find({ user: userId }, 'product');
            return wishList.map((item) => item.product?.toString());
        }
        else {
            return []
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};


// home feature product get 
route.get('/products/get/byfeatures', async (req, res) => {
    try {
        const features = await HomeFeatures.find();
        const userId = req.query?.userId

        let user
        if (userId !== "0") {
            user = await User.findById(userId);
        }

        const data = [];

        for (const feature of features) {

            if (!feature.status) {
                continue; // Skip features with status set to false
            }

            const products = await Product.find({ Features: feature.name, Product_Status: true }).populate('Category', 'categoryName')
                .populate({
                    path: 'Sub_Category',
                    select: 'subCategoryName',
                })
                .populate({
                    path: 'Variation',
                    select: '-__v',
                })

            const userWishlist = await getWishList(userId);
            let result = []

            // if (products.length === 0) {
            //     return res.status(200).json({ type: 'warning', message: 'No products found for the given category!', products: [] });
            // } else {
            result = products.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Category: product.Category?.categoryName,
                CategoryId: product.Category?._id,
                Product_Ori_Price: product?.Variation?.[0]?.Variation_Size?.[0]?.Disc_Price,
                Product_Dis_Price: (user?.User_Type === '0' || userId === "0"
                    ? (product?.Variation?.[0]?.Variation_Size?.[0]?.R0_Price)
                    : (user?.User_Type === '1' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R1_Price :
                        (user?.User_Type === '2' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R2_Price : (user?.User_Type === '3' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R3_Price : product?.Variation?.[0]?.Variation_Size?.[0]?.R4_Price)))),
                Description: product.Description,
                isFavorite: userWishlist.includes(product._id?.toString())
            }));
            // }

            data.push({
                name: feature.name || "",
                products: result || []
            });
        }

        res.status(200).json({ type: "success", message: "HomeFeatures Status update successfully!", data: data || [] });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});



module.exports = route

