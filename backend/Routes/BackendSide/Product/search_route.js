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
const Category = require('../../../Models/BackendSide/category_model')
const SubCategory = require('../../../Models/BackendSide/sub_category_model')


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

// search by name product
route.get('/get', async (req, res) => {
    try {
        const { query, userId } = req.query;

        let user
        if (userId !== "0") {
            user = await User.findById(userId);
        }

        // Construct a search query using regular expression to match Product_Name and other relevant fields
        const searchQuery = {
            $or: [
                { Product_Name: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { Description: { $regex: query, $options: 'i' } },
            ],
        };

        const products = await Product.find(searchQuery).limit(10); // Limit to a reasonable number of results
        if (products.length <= 0) {
            return res.status(200).json({ type: 'success', message: 'Products not found!', products: [] });
        }


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
        console.error(error);
    }
});

// filters products
// route.get('/get/filterList', async (req, res) => {

//     const { categoryId } = req.query

//     try {
//         const allSubCategory = await SubCategory.find({ category: categoryId }).lean();
//         // const colorsData = [
//         //     "RED", "YELLOW", "BLUE", "BLACK", "ORANGE", "WHITE", "PURPLE", "PINK",
//         //     "BROWN", "MAROON", "MAGENTA", "GOLD", "MUSTARD", "LEMON", "BEIGE", "SILVER",
//         //     "CREAM", "GREEN", "GRAY", "NAVY BLUE", "VIOLET", "INDIGO", "LIME", "OLIVE",
//         //     "AQUA", "TURQUOISE"
//         // ];
//         const rate = ["below 999", "1000-1500", "1500-2500", "2500 onwards"];
//         // const shipping = ["READY TO SHIP", "PRE LAUNCH"];
//         const sortBy = [
//             'relevance',
//             'price-low-to-high',
//             'price-high-to-low',
//             'new-arrival'
//         ]

//         const groupedData = {
//             // occasion: [],
//             // brand: [],
//             // fabric: [],
//             // colors: colorsData,
//             allSubCategory: [],
//             rate: rate,
//             sortBy: sortBy
//             // shipping: shipping,
//         };

//         allSubCategory.forEach(item => {
//             const { _id, subCategoryName, subCategoryStatus } = item;
//             if (subCategoryStatus === true) {
//                 groupedData.allSubCategory.push(subCategoryName.toUpperCase());
//             }
//         });

//         res.status(200).json({ type: 'success', message: 'Data found successfully!', data: groupedData });

//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.error(error);
//     }
// });

route.get('/get/filterList', async (req, res) => {

    const { categoryId } = req.query

    try {
        const allSubCategory = await SubCategory.find({ category: categoryId }).lean();

        const rate = ["below 999", "1000-1500", "1500-2500", "2500 onwards"];

        const sortBy = [
            'relevance',
            'price-low-to-high',
            'price-high-to-low',
            'new-arrival'
        ]

        const groupedData = {
            allSubCategory: [],
            rate: rate,
            sortBy: sortBy
        };

        allSubCategory.forEach(item => {
            const { _id, subCategoryName, subCategoryStatus } = item;
            if (subCategoryStatus === true) {
                groupedData.allSubCategory.push(subCategoryName.toUpperCase());
            }
        });

        res.status(200).json({ type: 'success', message: 'Data found successfully!', data: groupedData });

    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.error(error);
    }
});

// filter
// route.get('/filter/get/products', async (req, res) => {
//     try {
//         const { brands, fabric, occasion, color, rate, shipping, page, limit } = req.query;

//         const filters = {};

//         if (brands) {
//             const brandObjectIds = await Data.find({ Data_Type: "Brand Name", Data_Name: { $in: brands } }).distinct('_id');
//             filters['Brand_Name'] = { $in: brandObjectIds };
//             console.log(brandObjectIds)
//         }
//         if (fabric) {
//             const fabricObjectIds = await Data.find({ Data_Type: "FABRIC TYPE", Data_Name: { $in: fabric } }).distinct('_id');
//             filters['Fabric_Type'] = { $in: fabricObjectIds };
//         }
//         if (occasion) {
//             const occasionObjectIds = await Data.find({ Data_Type: "OCCASIONS", Data_Name: { $in: occasion } }).distinct('_id');
//             filters['Occasions'] = { $in: occasionObjectIds };
//         }

//         // ... similar approach for other filters (color, rate, shipping)

//         const products = await Product.find(filters)
//             .populate('Brand_Name')
//             .populate('Fabric_Type')
//             .populate('Occasions')
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean();

//         res.status(200).json({ type: 'success', message: 'Products found successfully!', data: products });

//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.error(error);
//     }
// });

// route.get('/filter/get/products', async (req, res) => {

//     try {
//         const { categoryId, brands, fabric, occasion, color, rate, shipping, page = "1", limit = 20, userId, sortBy } = req.query;

//         let user
//         if (userId !== "0") {
//             user = await User.findById(userId);
//         }

//         const filters = {};

//         if (categoryId) {
//             filters['Category'] = categoryId;
//         }


//         if (brands) {
//             const brandNamesArray = brands.split(',');
//             const regexColorNames = brandNamesArray.map(name => new RegExp(name, 'i'));
//             const brandObjectIds = await Data.find({ Data_Type: "Brand Name", Data_Name: { $in: regexColorNames } }).distinct('_id');
//             filters['Brand_Name'] = { $in: brandObjectIds };
//         }
//         // if (fabric) {
//         //     const fabricNamesArray = fabric.split(',');
//         //     const regexColorNames = fabricNamesArray.map(name => new RegExp(name, 'i'));
//         //     const fabricObjectIds = await Data.find({ Data_Type: "FABRIC TYPE", Data_Name: { $in: regexColorNames } }).distinct('_id');
//         //     filters['Fabric_Type'] = { $in: fabricObjectIds };
//         // }
//         // if (occasion) {
//         //     const occasionNamesArray = occasion.split(',');
//         //     const regexColorNames = occasionNamesArray.map(name => new RegExp(name, 'i'));
//         //     const occasionObjectIds = await Data.find({ Data_Type: "OCCASIONS", Data_Name: { $in: regexColorNames } }).distinct('_id');
//         //     filters['Occasions'] = { $in: occasionObjectIds };
//         // }

//         // if (color) {
//         //     const colorNamesArray = color.split(',');
//         //     const regexColorNames = colorNamesArray.map(name => new RegExp(name, 'i'));
//         //     const variationObjectIds = await Variation.find({
//         //         Variation_Name: { $in: regexColorNames }
//         //     }).distinct('_id');

//         //     // Use the found variation object IDs to filter products
//         //     filters['Variation'] = { $in: variationObjectIds };
//         // }
//         if (rate) {
//             const rateRanges = {
//                 'below 999': { $lte: 999 },
//                 '1000-1500': { $gte: 1000, $lte: 1500 },
//                 '1500-2500': { $gte: 1500, $lte: 2500 },
//                 '2500 onwards': { $gte: 2500 }
//             };
//             if (user?.User_Type === '0' || userId === "0") {
//                 filters['R0_Price'] = rateRanges[rate];
//             }
//             else if (user?.User_Type === '1') {
//                 filters['R1_Price'] = rateRanges[rate];
//             }
//             else if (user?.User_Type === '2') {
//                 filters['R2_Price'] = rateRanges[rate];
//             }
//             else if (user?.User_Type === '3') {
//                 filters['R3_Price'] = rateRanges[rate];
//             }
//             else if (user?.User_Type === '3') {
//                 filters['R4_Price'] = rateRanges[rate];
//             }
//         }
//         // if (shipping) {
//         //     filters['Shipping'] = shipping;
//         // }

//         const userWishlist = await getWishList(userId);

//         const sortOptions = {
//             relevance: {}, // Default sort
//             'price-low-to-high': { 'Product_Dis_Price': 1 },
//             'price-high-to-low': { 'Product_Dis_Price': -1 },
//             'new-arrival': { 'createdAt': -1 }
//         };

//         const products = await Product.find(filters)
//             .populate('Brand_Name')
//             .populate('Fabric_Type')
//             .populate('Occasions')
//             .sort(sortOptions[sortBy] || sortOptions['relevance'])
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean();

//         if (products.length <= 0) {
//             return res.status(200).json({ type: 'success', message: 'Products not found!', products: [] });
//         } else {
//             const result = products.map(product => {
//                 const variation = product?.Variation[0];
//                 const size = variation?.Variation_Size[0];
//                 let price;

//                 if (user?.User_Type === '0' || userId === "0") {
//                     price = size?.R0_Price;
//                 } else if (user?.User_Type === '1') {
//                     price = size?.R1_Price;
//                 } else if (user?.User_Type === '2') {
//                     price = size?.R2_Price;
//                 } else if (user?.User_Type === '3') {
//                     price = size?.R3_Price;
//                 } else {
//                     price = size?.R4_Price;
//                 }

//                 return {
//                     _id: product._id,
//                     Product_Name: product.Product_Name,
//                     SKU_Code: product.SKU_Code,
//                     Product_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${product?.Product_Image?.path?.replace(/\\/g, '/')}`,
//                     Category: product.Category?.categoryName,
//                     Product_Dis_Price: price,
//                     Product_Ori_Price: size?.Disc_Price,
//                     Gold_Price: product.Gold_Price,
//                     Silver_Price: product.Silver_Price,
//                     PPO_Price: product.PPO_Price,
//                     Description: product.Description,
//                     isFavorite: userWishlist.includes(product._id?.toString())
//                 };
//             });

//             const totalProducts = await Product.countDocuments(filters);

//             res.status(200).json({
//                 type: 'success', message: 'Products found successfully!',
//                 products: result,
//                 currentPage: page,
//                 totalPages: Math.ceil(totalProducts / limit)
//             });
//         }

//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.error(error);
//     }
// });

// route.get('/filter/get/products', async (req, res) => {
//     try {
//         const { categoryId, subcategoryId, rate, page = "1", limit = 20, userId, sortBy } = req.query;

//         let user;
//         if (userId !== "0") {
//             user = await User.findById(userId);
//         }

//         const filters = {};

//         if (categoryId) {
//             filters['Category'] = categoryId;
//         }


//         if (subcategoryId) {
//             const subCategoryNamesArray = subcategoryId.split(',');
//             const regexSubCategoryNames = subCategoryNamesArray.map(name => new RegExp(name, 'i'));
//             const SubCategoryObjectIds = await SubCategory.find({ subCategoryName: { $in: regexSubCategoryNames } }).distinct('_id');
//             filters['Sub_Category'] = { $in: SubCategoryObjectIds };
//         }

//         let products = await Product.find(filters)
//             .populate('Variation')
//             .populate('Sub_Category')
//             .populate('Category')
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean();


//         if (rate) {

//             const rateRanges = {
//                 'below 999': { $gte: 0, $lte: 999 },
//                 '1000-1500': { $gte: 1000, $lte: 1500 },
//                 '1500-2500': { $gte: 1500, $lte: 2500 },
//                 '2500 onwards': { $gte: 2500, $lte: 100000000000000 }
//             };

//             products = products.filter(product => {
//                 const variation = product?.Variation[0];
//                 const size = variation?.Variation_Size[0];
//                 // const price = size?.R0_Price;

//                 let price = 0
//                 if (user?.User_Type === '0' || userId === "0") {
//                     price = size?.R0_Price
//                 }
//                 else if (user?.User_Type === '1') {
//                     price = size?.R1_Price
//                 }
//                 else if (user?.User_Type === '2') {
//                     price = size?.R2_Price
//                 }
//                 else if (user?.User_Type === '3') {
//                     price = size?.R3_Price
//                 }
//                 else if (user?.User_Type === '4') {
//                     price = size?.R4_Price
//                 }

//                 return price && price >= rateRanges[rate].$gte && price <= rateRanges[rate].$lte;
//             });

//         }

//         const userWishlist = await getWishList(userId);

//         let sortOption = {};

//         switch (sortBy) {
//             case 'price-low-to-high':
//                 sortOption = { 'Product_Dis_Price': 1 };
//                 break;
//             case 'price-high-to-low':
//                 sortOption = { 'Product_Dis_Price': -1 };
//                 break;
//             case 'new-arrival':
//                 sortOption = { 'createdAt': -1 };
//                 break;
//             default:
//                 sortOption = {}; // Default sort
//         }

//         products = products.sort((a, b) => a.Product_Dis_Price - b.Product_Dis_Price);

//         // const products = await Product.find(filters)
//         //     .populate('Variation')
//         //     .populate('Sub_Category')
//         //     .populate('Category')
//         //     .sort(sortOptions[sortBy] || sortOptions['relevance'])
//         //     .skip((page - 1) * limit)
//         //     .limit(limit)
//         //     .lean();


//         if (products.length <= 0) {
//             return res.status(200).json({ type: 'success', message: 'Products not found!', products: [] });
//         } else {
//             const result = products.map(product => {
//                 const variation = product?.Variation[0];
//                 const size = variation?.Variation_Size[0];
//                 let price;

//                 if (user?.User_Type === '0' || userId === "0") {
//                     price = size?.R0_Price;
//                 } else if (user?.User_Type === '1') {
//                     price = size?.R1_Price;
//                 } else if (user?.User_Type === '2') {
//                     price = size?.R2_Price;
//                 } else if (user?.User_Type === '3') {
//                     price = size?.R3_Price;
//                 } else {
//                     price = size?.R4_Price;
//                 }

//                 return {
//                     _id: product._id,
//                     Product_Name: product.Product_Name,
//                     SKU_Code: product.SKU_Code,
//                     Product_Image: `${process.env.PORT}/${product?.Product_Image?.replace(/\\/g, '/')}`,
//                     Category: product.Category?.categoryName,
//                     SubCategory: product.Sub_Category?.subCategoryName,
//                     Product_Dis_Price: price,
//                     Product_Ori_Price: size?.Disc_Price,
//                     Description: product.Description,
//                     isFavorite: userWishlist.includes(product._id?.toString())
//                 };
//             });

//             const totalProducts = await Product.countDocuments(filters);

//             res.status(200).json({
//                 type: 'success', message: 'Products found successfully!',
//                 products: result,
//                 currentPage: page,
//                 totalPages: Math.ceil(totalProducts / limit)
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.error(error);
//     }
// });


function getPriceForUser(user, product) {
    const variation = product?.Variation[0];
    const size = variation?.Variation_Size[0];

    if (user === undefined) {
        user = "0"
    }

    let price = 0;

    if (user?.User_Type === '0' || user === "0") {
        price = size?.R0_Price;
    }
    else if (user?.User_Type === '1') {
        price = size?.R1_Price;
    }
    else if (user?.User_Type === '2') {
        price = size?.R2_Price;
    }
    else if (user?.User_Type === '3') {
        price = size?.R3_Price;
    }
    else if (user?.User_Type === '4') {
        price = size?.R4_Price;
    }

    return price || 0;
}

route.get('/filter/get/products', async (req, res) => {
    try {
        const { categoryId, subcategoryId, rate, page = "1", limit = 20, userId, sortBy } = req.query;

        let user;
        if (userId !== "0") {
            user = await User.findById(userId);
        }

        const filters = {};

        if (categoryId) {
            filters['Category'] = categoryId;
        }

        if (subcategoryId) {
            const subCategoryNamesArray = subcategoryId.split(',');
            const regexSubCategoryNames = subCategoryNamesArray.map(name => new RegExp(name, 'i'));
            const SubCategoryObjectIds = await SubCategory.find({ subCategoryName: { $in: regexSubCategoryNames } }).distinct('_id');
            filters['Sub_Category'] = { $in: SubCategoryObjectIds };
        }

        let products = await Product.find(filters)
            .populate('Variation')
            .populate('Sub_Category')
            .populate('Category')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        if (rate) {
            const rateRanges = {
                'below 999': { $gte: 0, $lte: 999 },
                '1000-1500': { $gte: 1000, $lte: 1500 },
                '1500-2500': { $gte: 1500, $lte: 2500 },
                '2500 onwards': { $gte: 2500, $lte: 100000000000000 }
            };

            products = products.filter(product => {
                const variation = product?.Variation[0];
                const size = variation?.Variation_Size[0];

                let price = 0;
                if (user?.User_Type === '0' || userId === "0") {
                    price = size?.R0_Price;
                }
                else if (user?.User_Type === '1') {
                    price = size?.R1_Price;
                }
                else if (user?.User_Type === '2') {
                    price = size?.R2_Price;
                }
                else if (user?.User_Type === '3') {
                    price = size?.R3_Price;
                }
                else if (user?.User_Type === '4') {
                    price = size?.R4_Price;
                }

                return price && price >= rateRanges[rate].$gte && price <= rateRanges[rate].$lte;
            });
        }

        const userWishlist = await getWishList(userId);


        if (products.length <= 0) {
            return res.status(200).json({ type: 'success', message: 'Products not found!', products: [] });
        } else {

            // Sort products based on the sortBy parameter
            if (sortBy === 'price-low-to-high') {
                products.sort((a, b) => {
                    const priceA = getPriceForUser(user, a);
                    const priceB = getPriceForUser(user, b);
                    return priceA - priceB;
                });
            } else if (sortBy === 'price-high-to-low') {
                products.sort((a, b) => {
                    const priceA = getPriceForUser(user, a);
                    const priceB = getPriceForUser(user, b);
                    return priceB - priceA;
                });
            }

            const result = products.map(product => {
                const variation = product?.Variation[0];
                const size = variation?.Variation_Size[0];
                let price;

                if (user?.User_Type === '0' || userId === "0") {
                    price = size?.R0_Price;
                } else if (user?.User_Type === '1') {
                    price = size?.R1_Price;
                } else if (user?.User_Type === '2') {
                    price = size?.R2_Price;
                } else if (user?.User_Type === '3') {
                    price = size?.R3_Price;
                } else {
                    price = size?.R4_Price;
                }

                return {
                    _id: product._id,
                    Product_Name: product.Product_Name,
                    SKU_Code: product.SKU_Code,
                    Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                    Category: product.Category?.categoryName,
                    SubCategory: product.Sub_Category?.subCategoryName,
                    Product_Dis_Price: price,
                    Product_Ori_Price: size?.Disc_Price,
                    Description: product.Description,
                    isFavorite: userWishlist.includes(product._id?.toString())
                };
            });

            const totalProducts = await Product.countDocuments(filters);

            res.status(200).json({
                type: 'success', message: 'Products found successfully!',
                products: result,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit)
            });
        }
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.error(error);
    }
});


// route.get('/filter/get/products', async (req, res) => {
//     try {
//         const { categoryId, subcategoryId, rate, page = "1", limit = 20, userId, sortBy } = req.query;

//         let user;
//         if (userId !== "0") {
//             user = await User.findById(userId);
//         }

//         const filters = {};

//         if (categoryId) {
//             filters['Category'] = categoryId;
//         }

//         if (subcategoryId) {
//             const subCategoryNamesArray = subcategoryId.split(',');
//             const regexSubCategoryNames = subCategoryNamesArray.map(name => new RegExp(name, 'i'));
//             const SubCategoryObjectIds = await SubCategory.find({ subCategoryName: { $in: regexSubCategoryNames } }).distinct('_id');
//             filters['Sub_Category'] = { $in: SubCategoryObjectIds };
//         }

//         const userWishlist = await getWishList(userId);

//         const sortOptions = {
//             relevance: {}, // Default sort
//             'price-low-to-high': { 'Product_Dis_Price': 1 },
//             'price-high-to-low': { 'Product_Dis_Price': -1 },
//             'new-arrival': { 'createdAt': -1 }
//         };

//         let products = await Product.find(filters)
//             .populate('Variation')
//             .populate('Sub_Category')
//             .populate('Category')
//             .lean();

//         if (rate) {
//             const rateRanges = {
//                 'below 999': { $lte: 999 },
//                 '1000-1500': { $gte: 1000, $lte: 1500 },
//                 '1500-2500': { $gte: 1500, $lte: 2500 },
//                 '2500 onwards': { $gte: 2500 }
//             };
//             products = products.filter(product => {
//                 const variation = product?.Variation[0];
//                 const size = variation?.Variation_Size[0];
//                 const price = size?.R0_Price;
//                 return price && price >= rateRanges[rate].$gte && price <= rateRanges[rate].$lte;
//             });

//         }

//         console.log(products)

//         if (products.length <= 0) {
//             return res.status(200).json({ type: 'success', message: 'Products not found!', products: [] });
//         } else {
//             const result = products.map(product => {
//                 const variation = product?.Variation[0];
//                 const size = variation?.Variation_Size[0];

//                 return {
//                     _id: product._id,
//                     Product_Name: product.Product_Name,
//                     SKU_Code: product.SKU_Code,
//                     Product_Image: `${process.env.PORT}/${product?.Product_Image?.replace(/\\/g, '/')}`,
//                     Category: product.Category?.categoryName,
//                     SubCategory: product.Sub_Category?.subCategoryName,
//                     Product_Dis_Price: size.R0_Price, // Assuming the default is R0_Price
//                     Product_Ori_Price: size?.Disc_Price,
//                     Description: product.Description,
//                     isFavorite: userWishlist.includes(product._id?.toString())
//                 };
//             });

//             const totalProducts = products.length;

//             res.status(200).json({
//                 type: 'success', message: 'Products found successfully!',
//                 products: result,
//                 currentPage: page,
//                 totalPages: Math.ceil(totalProducts / limit)
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.error(error);
//     }
// });








module.exports = route