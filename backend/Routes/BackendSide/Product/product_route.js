const express = require('express');
const route = express.Router();
const multer = require('multer');
const { Product, Variation } = require('../../../Models/BackendSide/product_model')
const User = require('../../../Models/FrontendSide/user_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const Wishlist = require('../../../Models/FrontendSide/wish_list_model');
const Review = require('../../../Models/FrontendSide/review_model')
const fs = require('fs');
const path = require('path')


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, './imageUploads/backend/product');
        } else if (file.fieldname === 'video') {
            cb(null, './videoUploads/backend/product');
        }
    },
    filename: function (req, file, cb) {
        const originalFilename = file.originalname;
        const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        const filename = `${file.fieldname}_${Date.now()}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Create Product
route.post('/add', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {

    try {
        const {
            Product_Name,
            SKU_Code,
            Category,
            Sub_Category,
            Product_Youtube_Video,
            Product_Dimenstion,
            Product_Weight,
            Description,
            Price
        } = req.body;


        const product = new Product({
            Product_Name: Product_Name,
            SKU_Code: SKU_Code,
            Category: Category,
            Sub_Category,
            Product_Youtube_Video,
            Product_Dimenstion,
            Product_Weight,
            Price,
            Description: Description,
        });

        await product.save();

        if (req.files['image']) {
            const imageFile = req.files['image'][0];
            const originalFilename = imageFile.originalname;
            const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${Product_Name.slice(0, 4).replace(/\s/g, '_')}_${random}${extension}`;
            const imagePath = 'imageUploads/backend/product/' + imageFilename;

            try {
                fs.renameSync(imageFile.path, imagePath);
            } catch (error) {

            }

            const image = imagePath
            product.Product_Image = image;
        }

        if (req.files['video']) {
            const videoFile = req.files['video'][0];
            const videoFilename = `${Product_Name.slice(4).replace(/\s/g, '_')}.mp4`;
            const videoPath = 'videoUploads/backend/product/' + videoFilename;

            try {
                fs.renameSync(videoFile.path, videoPath);
            } catch (error) {

            }

            const video = videoPath
            product.Product_Video = video;
        }

        await product.save();

        res.status(200).json({ type: "success", message: "Product added successfully!", productId: product._id });

    } catch (error) {
        try {
            if (req.files['image']) {
                fs?.unlinkSync(req?.files['image'][0]?.path);
            }

            if (req.files['video']) {
                fs?.unlinkSync(req?.files['video'][0]?.path);
            }
        } catch (error) {

        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error, "error")
    }
});

// get all product
route.get('/get', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
            .populate({
                path: 'Category',
                select: 'categoryName',
            })
            .populate({
                path: 'Sub_Category',
                select: 'subCategoryName',
            })
            .populate({
                path: 'Variation',
                select: '-__v',
            })

        if (products) {

            // for data table (admin)
            const adminProducts = products.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Product_Video: `${process.env.IMAGE_URL}/${product?.Product_Video?.replace(/\\/g, '/')}`,
                Product_Youtube_Video: product?.Product_Youtube_Video,
                Category: {
                    _id: product.Category?._id,
                    categoryName: product.Category?.categoryName,
                },
                Sub_Category: {
                    _id: product.Sub_Category?._id,
                    subCategoryName: product.Sub_Category?.subCategoryName,
                },
                Price: product.Price,
                Description: product?.Description,
                Product_Dimenstion: product?.Product_Dimenstion,
                Product_Weight: product?.Product_Weight,
                // Variation: product.Variation,
                // variation: product?.Variation?.map(variation => ({
                //     variation_Id: variation?._id,
                //     variation_Name: variation?.Variation_Name,
                //     variation_Sizes: variation?.Variation_Size?.map(variation => ({
                //         name: variation?.Size_Name,
                //         stock: variation?.Size_Stock
                //     })),
                //     variation_Images: variation?.Variation_Images?.map(variation => ({
                //         variation_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${variation?.path?.replace(/\\/g, '/')}`
                //     })),
                //     variation_Status: variation?.Variation_Status
                // })),
                Variation_Count: product.Variation.length,
                // All_Pro: product.All_Pro,
                // New_Arrival: product.New_Arrival,
                // Most_Sell: product.Most_Sell,
                category: product.Category?.categoryName,
                subCategory: product.Sub_Category?.subCategoryName,
                Features: product?.Features,
                Product_Status: product?.Product_Status
            }));


            const product = await Product.find({ Product_Status: true }).sort({ createdAt: -1 })
                .populate({
                    path: 'Category',
                    select: 'categoryName',
                })
                .populate({
                    path: 'Sub_Category',
                    select: 'subCategoryName',
                })


            // // for show frontend side
            let frontendProducts = []
            if (product) {
                frontendProducts = product.map(product => ({
                    _id: product._id,
                    Product_Name: product.Product_Name,
                    SKU_Code: product.SKU_Code,
                    Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                    Product_Video: `${process.env.IMAGE_URL}/${product?.Product_Video?.replace(/\\/g, '/')}`,
                    Product_Youtube_Video: product?.Product_Youtube_Video,
                    Category: {
                        _id: product.Category?._id,
                        categoryName: product.Category?.categoryName,
                    },
                    Sub_Category: {
                        _id: product.Sub_Category?._id,
                        subCategoryName: product.Sub_Category?.subCategoryName,
                    },
                    Price: product.Price,
                    Description: product?.Description,
                    Product_Dimenstion: product?.Product_Dimenstion,
                    Product_Weight: product?.Product_Weight,
                    // Variation: product.Variation,
                    // variation: product?.Variation?.map(variation => ({
                    //     variation_Id: variation?._id,
                    //     variation_Name: variation?.Variation_Name,
                    //     variation_Sizes: variation?.Variation_Size?.map(variation => ({
                    //         name: variation?.Size_Name,
                    //         stock: variation?.Size_Stock
                    //     })),
                    //     variation_Images: variation?.Variation_Images?.map(variation => ({
                    //         variation_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${variation?.path?.replace(/\\/g, '/')}`
                    //     })),
                    //     variation_Status: variation?.Variation_Status
                    // })),
                    Variation_Count: product.Variation.length,
                    // All_Pro: product.All_Pro,
                    // New_Arrival: product.New_Arrival,
                    // Most_Sell: product.Most_Sell,
                    category: product.Category?.categoryName,
                    subCategory: product.Sub_Category?.subCategoryName,
                    Features: product?.Features,
                    Product_Status: product?.Product_Status
                }));
            };

            res.json({
                type: "success",
                message: "Products found successfully!",
                product: adminProducts || [],
                product_data: frontendProducts || []
            });
        } else {
            res.status(404).json({ type: "warning", message: "Products not found!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Failed to fetch products" });
    }
});

// get all product for demo
route.get('/mob/pdf/get', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
            .populate({
                path: 'Category',
                select: 'categoryName',
            })

        if (products) {

            const adminProducts = products.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Category_Name: product.Category?.categoryName,
                CategoryId: product?.Category?._id,
            }));

            res.json({
                type: "success",
                message: "Products found successfully!",
                product: adminProducts || [],
            });
        } else {
            res.status(404).json({ type: "warning", message: "Products not found!", product: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Failed to fetch products" });
    }
});

// find particular product
route.get('/get/:id', async (req, res) => {

    const productId = req?.params?.id

    try {
        const product = await Product.findById(productId)
            .populate({
                path: 'Category',
                select: 'categoryName',
            })
            .populate({
                path: 'Sub_Category',
                select: 'subCategoryName',
            })
            .populate({
                path: 'Variation',
                select: '-__v',
            })

        if (product) {
            const frontendProducts = {

                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Product_Video: `${process.env.IMAGE_URL}/${product?.Product_Video?.replace(/\\/g, '/')}`,
                Category: {
                    _id: product.Category?._id,
                    categoryName: product.Category?.categoryName,
                },
                Sub_Category: {
                    _id: product.Sub_Category?._id,
                    subCategoryName: product.Sub_Category?.subCategoryName,
                },
                Price: product?.Price,
                Description: product?.Description,
                Product_Dimenstion: product?.Product_Dimenstion,
                Product_Youtube_Video: product?.Product_Youtube_Video,
                Product_Weight: product?.Product_Weight,
                Features: product?.Features,
                Variation_Count: product.Variation.length,
                Variation: product?.Variation?.map(variation => ({
                    _id: variation?._id,
                    variation_Name: variation?.Variation_Name,
                    size_count: variation?.Variation_Size?.length,
                    variation_Sizes: variation?.Variation_Size?.map(variation => ({
                        _id: variation?._id,
                        name: variation?.Size_Name,
                        stock: variation?.Size_Stock,
                        discPrice: variation?.Disc_Price,
                        userPrice: variation?.R0_Price,
                        R1Price: variation?.R1_Price,
                        R2Price: variation?.R2_Price,
                        R3Price: variation?.R3_Price,
                        R4Price: variation?.R4_Price,
                        R1MinQuan: variation?.R1_Min_Quantity,
                        R2MinQuan: variation?.R2_Min_Quantity,
                        R3MinQuan: variation?.R3_Min_Quantity,
                        R4MinQuan: variation?.R4_Min_Quantity
                    })),
                    variation_Images: variation?.Variation_Images?.map(image => `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`),
                    variation_Status: variation?.Variation_Status
                })),
            }
            res.json({ type: "success", message: "Products found successfully!", products: frontendProducts || [] })
        }
        else {
            res.json({ type: "success", message: "Products Not Found!", products: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Failed to fetch products" });
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

// get all product for particular category (mobile) 
route.get('/mob/get/productlist/:id', async (req, res) => {
    const userId = req.query?.userId
    const categoryId = req.params.id;

    let user
    if (userId !== "0") {
        user = await User.findById(userId);
    }


    try {
        const products = await Product.find({ Category: categoryId, Product_Status: true })
            .populate('Category', 'categoryName')
            .populate({
                path: 'Sub_Category',
                select: 'subCategoryName',
            })
            .populate({
                path: 'Variation',
                select: '-__v',
            })

        const userWishlist = await getWishList(userId);

        if (products.length === 0) {
            return res.status(200).json({ type: 'warning', message: 'No products found for the given category!', products: [] });
        } else {
            const result = products.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Category: product.Category?.categoryName,
                Product_Ori_Price: product?.Variation?.[0]?.Variation_Size?.[0]?.Disc_Price,
                Product_Dis_Price: (user?.User_Type === '0' || userId === "0"
                    ? (product?.Variation?.[0]?.Variation_Size?.[0]?.R0_Price)
                    : (user?.User_Type === '1' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R1_Price :
                        (user?.User_Type === '2' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R2_Price : (user?.User_Type === '3' ? product?.Variation?.[0]?.Variation_Size?.[0]?.R3_Price : product?.Variation?.[0]?.Variation_Size?.[0]?.R4_Price)))),
                Description: product.Description,
                isFavorite: userWishlist.includes(product._id?.toString())
            }));

            res.status(200).json({ type: 'success', message: 'Products found successfully!', products: result || [] });
        }
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// get all product features product (mobile) 
route.get('/mob/get/features/productlist', async (req, res) => {
    const HomeFeatures = req?.query?.HomeFeatures
    const userId = req?.query?.userId

    let user
    if (userId !== "0") {
        user = await User.findById(userId);
    }

    try {
        const products = await Product.find({ Product_Status: true })
            .populate('Category', 'categoryName')
            .populate({
                path: 'Variation',
                select: '-__v',
            })

        let result = []
        const userWishlist = await getWishList(userId);
        if (products.length === 0) {
            res.status(200).json({ type: 'warning', message: 'No products found!', products: [] });
        } else {
            result = products.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${product?.Product_Image?.path?.replace(/\\/g, '/')}`,
                Category: product.Category?.categoryName,
                categoryId: product.Category?._id,
                // Brand_Name: product?.Brand_Name?.Data_Name,
                // Fabric_Type: product?.Fabric_Type?.Data_Name,
                // Occasions: product?.Occasions?.Data_Name,

                Product_Dis_Price: (user?.User_Type === '0' || userId === "0"
                    ? (product.Product_Dis_Price)
                    : (user?.User_Type === '1' ? product.Gold_Price :
                        (user?.User_Type === '2' ? product.Silver_Price : product.PPO_Price))),

                Product_Ori_Price: (user?.User_Type === '0' || userId === "0"
                    ? (product.Product_Ori_Price) : (product.Product_Dis_Price)),

                Max_Dis_Price: product.Max_Dis_Price,
                Gold_Price: product.Gold_Price,
                Silver_Price: product.Silver_Price,
                PPO_Price: product.PPO_Price,
                Description: product.Description,
                Product_Label: product.Product_Label,
                Ready_to_wear: product.Ready_to_wear,
                Popular_pick: product.Popular_pick,
                Trendy_collection: product.Trendy_collection,
                isFavorite: userWishlist.includes(product._id?.toString())
            }));

            let filteredProducts = []

            if (HomeFeatures === '0') {
                filteredProducts = result?.filter(product => product?.Ready_to_wear);
            }
            else if (HomeFeatures === '1') {
                filteredProducts = result?.filter(product => product?.Popular_pick);
            }
            else if (HomeFeatures === '2') {
                filteredProducts = result?.filter(product => product?.Trendy_collection);
            }

            res.status(200).json({ type: 'success', message: 'Products found successfully!', products: filteredProducts || [] });
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// function for get ratings 
async function getRatings(productId) {

    const reviewsForProduct = await Review.find({
        productIds: productId
    })

    if (reviewsForProduct.length === 0) {
        return { rating: 0, ratingCount: 0 };
    }

    const totalRating = reviewsForProduct.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    let rating = (totalRating / reviewsForProduct.length)
    let ratingCount = reviewsForProduct.length
    rating = rating.toFixed(1);
    return { rating, ratingCount };

}

// get product using id
route.get('/mob/get/single/:id', async (req, res) => {

    const userId = req?.query?.userId
    const productId = req.params.id

    let user
    if (userId !== "0") {
        user = await User.findById(userId);
    }

    const userWishlist = await getWishList(userId);

    const { rating, ratingCount } = await getRatings(productId);

    try {
        const product = await Product.findById(productId)
            .populate('Category', 'categoryName _id')
            .populate({
                path: 'Sub_Category',
                select: 'subCategoryName',
            })
            .populate({
                path: 'Variation',
                select: '-__v',
                match: { Variation_Status: true }
            })
        if (!product) {
            return res.status(200).json({ type: 'warning', message: 'No products found!', products: [] });
        } else {
            const result = {
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Product_Video: `${process.env.IMAGE_URL}/${product?.Product_Video?.replace(/\\/g, '/')}`,
                categoryId: product.Category?._id,
                categoryName: product.Category?.categoryName,
                subCategoryId: product.Sub_Category?._id,
                subCategoryName: product.Sub_Category?.subCategoryName,
                Description: product?.Description,
                Product_Dimenstion: product?.Product_Dimenstion,
                Product_Youtube_Video: product?.Product_Youtube_Video,
                Product_Weight: product?.Product_Weight,
                Variation: product?.Variation?.map(variation => ({
                    _id: variation?._id,
                    variation_Name: variation?.Variation_Name,
                    size_count: variation?.Variation_Size?.length,
                    variation_Sizes: variation?.Variation_Size?.map(variation => ({
                        _id: variation?._id,
                        name: variation?.Size_Name,
                        stock: variation?.Size_Stock,
                        originalPrice: variation?.Disc_Price,
                        discountPrice: (user?.User_Type === '0' || userId === "0"
                            ? (variation?.R0_Price)
                            : (user?.User_Type === '1' ? variation?.R1_Price :
                                (user?.User_Type === '2' ? variation?.R2_Price :
                                    (user?.User_Type === '3' ? variation?.R3_Price :
                                        variation?.R4_Price)))),
                        minQuantity: (user?.User_Type === '0' || userId === "0"
                            ? (0)
                            : (user?.User_Type === '1' ? variation?.R1_Min_Quantity :
                                (user?.User_Type === '2' ? variation?.R2_Min_Quantity :
                                    (user?.User_Type === '3' ? variation?.R3_Min_Quantity :
                                        variation?.R4_Min_Quantity)))),
                    })),
                    // variation_Images: variation?.Variation_Images?.map(image => `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`),
                    variation_Images: variation?.Variation_Images?.map(image => ({
                        variation_Image: `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`,
                    })),
                })),
                isFavorite: userWishlist.includes(product._id?.toString()),
                ratings: rating,
                ratingCount: ratingCount
            };

            res.status(200).json({ type: 'success', message: 'Products found successfully!', products: [result] || [] });
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// delete product by id
route.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ type: 'warning', message: 'Product not found!' });
        }

        const variationIds = product.Variation.map((variation) => variation?._id);
        const variations = await Variation.find({ _id: { $in: variationIds } });

        // Collect all image and video paths for deletion
        let mediaPaths = [];

        variations.forEach((variation) => {
            if (variation?.Variation_Images) {
                mediaPaths.push(variation?.Variation_Images);
            }
        });

        if (product.Product_Image) {
            mediaPaths.push(product.Product_Image);
        }

        if (product.Product_Video) {
            mediaPaths.push(product.Product_Video);
        }

        // Delete variations and product
        await Variation.deleteMany({ _id: { $in: variationIds } });
        await Product.findByIdAndDelete(productId);

        // Delete all associated media
        mediaPaths?.forEach((mediaPath) => {
            if (mediaPath) {
                try {
                    fs.unlinkSync(path.join(mediaPath));
                } catch (error) {

                }
            }
        });


        res.status(200).json({
            type: 'success',
            message: 'Product and associated variations, images, and videos deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// delete many products by id
route.delete("/deletes", async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No product IDs provided" });
        }

        // Retrieve the products to be deleted
        const products = await Product.find({ _id: { $in: ids } });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Get the IDs of all variations associated with the products
        const variationIds = products.flatMap((product) =>
            product.Variation.map((variation) => variation._id)
        );

        // Get the image and video paths of all variations, product images, and videos
        let mediaPaths = [];
        products.forEach((product) => {
            mediaPaths.push(product.Product_Image);
            mediaPaths.push(product.Product_Video);
            product.Variation.forEach((variation) => {
                if (variation.Variation_Image) {
                    mediaPaths.push(variation.Variation_Image);
                }
            });
        });

        // Delete the variations from the variations table
        await Variation.deleteMany({ _id: { $in: variationIds } });

        // Delete the images and videos from the local folder
        mediaPaths.forEach((mediaPath) => {
            if (mediaPath) {
                try {
                    fs.unlinkSync(path.join(mediaPath));
                } catch (error) {
                    console.error(`Error deleting file at path: ${mediaPath}`);
                }
            }
        });

        // Delete the products from the products table
        await Product.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            type: 'success',
            message: 'All Products and associated variations, images, and videos deleted successfully!',
        });
    } catch (error) {
        console.error("Error deleting products:", error);
        res.status(500).json({ message: "Failed to delete products" });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const productId = await req.params.id

    try {
        const { Product_Status } = req.body
        const newProduct = await Product.findByIdAndUpdate(productId)
        newProduct.Product_Status = await Product_Status

        await newProduct.save()
        res.status(200).json({ type: "success", message: "Product Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update product features
route.patch("/update/features/:id", async (req, res) => {

    const productId = await req.params.id

    try {
        const { Ready_to_wear, Trendy_collection, Popular_pick } = req.body

        const newProduct = await Product.findByIdAndUpdate(productId)

        newProduct.Ready_to_wear = await Ready_to_wear
        newProduct.Trendy_collection = await Trendy_collection
        newProduct.Popular_pick = await Popular_pick

        await newProduct.save()
        res.status(200).json({ type: "success", message: "Product Features update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }

})

// update product shipping
route.patch("/update/shipping/:id", async (req, res) => {

    const productId = await req.params.id

    try {
        const { Shipping } = req.body
        const newProduct = await Product.findByIdAndUpdate(productId)

        newProduct.Shipping = await Shipping

        await newProduct.save()
        res.status(200).json({ type: "success", message: "Product Shipping update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }

})

// Update product 
route.patch('/update/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {

    try {
        const productId = req.params.id;
        const {
            Product_Name,
            SKU_Code,
            Category,
            Sub_Category,
            Product_Youtube_Video,
            Product_Dimenstion,
            Product_Weight,
            Description,
            Price,
            Features
        } = req.body;


        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            try {
                if (req.files['image']) {
                    fs.unlinkSync(req?.files['image'][0]?.path);
                }
                if (req.files['video']) {
                    fs.unlinkSync(req?.files['video'][0]?.path);
                }
            } catch (error) {

            }

            return res.status(404).json({
                type: "warning",
                message: 'Product not found!'
            });
        }


        if (
            Product_Name.toLowerCase() !== existingProduct.Product_Name.toLowerCase()
        ) {
            const duplicateProduct = await Product.findOne({
                $and: [
                    { Product_Name: { $regex: `^${Product_Name}$`, $options: 'i' } },
                    { Category: Category }
                ]
            });

            if (duplicateProduct) {
                try {
                    if (req.files['image']) {
                        fs.unlinkSync(req?.files['image'][0]?.path);
                    }
                    if (req.files['video']) {
                        fs.unlinkSync(req?.files['video'][0]?.path);
                    }
                } catch (error) {

                }

                return res.status(202).json({
                    type: "warning",
                    message: 'Product with the same Product_Name already exists for the selected Category.'
                });
            }
        }

        existingProduct.Product_Name = Product_Name;
        existingProduct.SKU_Code = SKU_Code;
        existingProduct.Category = Category;
        existingProduct.Sub_Category = Sub_Category;
        existingProduct.Product_Youtube_Video = Product_Youtube_Video;
        existingProduct.Product_Dimenstion = Product_Dimenstion;
        existingProduct.Product_Weight = Product_Weight;
        existingProduct.Description = Description;
        existingProduct.Features = Features;
        // existingProduct.Price = Price;

        // Handle the image update
        if (req.files['image']) {
            const imageFile = req.files['image'][0];
            const originalFilename = imageFile.originalname;
            const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${Product_Name.slice(0, 4).replace(/\s/g, '_')}_${random}${extension}`;
            const imagePath = 'imageUploads/backend/product/' + imageFilename;

            try {
                fs.renameSync(imageFile.path, imagePath);
            } catch (error) {

            }
            const image = imagePath
            existingProduct.Product_Image = image;
        }

        // Handle the video update
        if (req.files['video']) {
            const videoFile = req.files['video'][0];
            const videoFilename = `${Product_Name.replace(/\s/g, '_')}.mp4`;
            const videoPath = 'videoUploads/backend/product/' + videoFilename;

            try {
                fs.renameSync(videoFile.path, videoPath);
            } catch (error) {

            }

            const video = videoPath
            existingProduct.Product_Video = video;
        }

        await existingProduct.save();

        res.status(200).json({ type: "success", message: "Product updated successfully!" });
    } catch (error) {
        try {
            if (req.files['image']) {
                fs.unlinkSync(req?.files['image'][0]?.path);
            }
            if (req.files['video']) {
                fs.unlinkSync(req?.files['video'][0]?.path);
            }
        } catch (error) {

        }

        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// lowstock products
route.get('/lowstockproducts/get', async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'Category',
                select: 'categoryName',
            })
            .populate({
                path: 'Variation',
                select: '-__v',
            });

        if (products) {
            const lowStockVariationSizes = products
                .map(product => {
                    const lowStockVariations = product.Variation.filter(variation =>
                        variation.Variation_Size.some(size => size.Size_Stock >= 0 && size.Size_Stock <= 20)
                    );

                    return lowStockVariations.flatMap(variation => (
                        variation.Variation_Size.filter(size =>
                            size.Size_Stock >= 0 && size.Size_Stock <= 20
                        ).map(size => ({
                            _id: product._id,
                            Product_Name: product.Product_Name,
                            SKU_Code: product.SKU_Code,
                            Category: product.Category?.categoryName || '',
                            Product_Image: `${process.env.IMAGE_URL}/${variation?.Variation_Images[0]?.replace(/\\/g, '/')}` || "",
                            Variation_Name: variation.Variation_Name,
                            Variation_Id: variation._id,
                            Size_Name: size.Size_Name,
                            Size_Stock: size.Size_Stock,
                            Size_Id: size._id
                        }))
                    ));
                })
                .flat();

            res.json({
                type: "success",
                message: "Low stock variation sizes found successfully!",
                low_stock_variation_sizes: lowStockVariationSizes || [],
            });
        } else {
            res.status(404).json({ type: "warning", message: "Products not found!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Failed to fetch products" });
    }
});

// change the particular size stock of variations
route.put('/edit/variation/size/stock/:variationId/:sizeId', async (req, res) => {

    const { variationId, sizeId } = req.params;
    const { Size_Stock } = req.body;

    try {
        const variation = await Variation.findById(variationId);

        if (!variation) {
            return res.status(404).json({ type: "warning", message: "Variation not found!" });
        }

        const sizeIndex = variation.Variation_Size.findIndex(size => size._id.toString() === sizeId);

        if (sizeIndex === -1) {
            return res.status(404).json({ type: "warning", message: "Size not found!" });
        }

        variation.Variation_Size[sizeIndex].Size_Stock = Size_Stock;

        await variation.save();

        res.status(200).json({
            type: "success",
            message: "Stock updated successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Failed to update stock" });
    }
});




module.exports = route;
