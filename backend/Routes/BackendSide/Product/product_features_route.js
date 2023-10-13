const express = require('express');
const route = express.Router();
const User = require('../../../Models/FrontendSide/user_model')
const { Product, Variation } = require('../../../Models/BackendSide/product_model')
const Wishlist = require('../../../Models/FrontendSide/wish_list_model');

// get wishlist from wishlist Model
const getWishList = async (userId) => {
    try {
        if (userId != "0") {
            const wishList = await Wishlist.find({ user: userId }, 'product');
            return wishList.map((item) => item.product?.toString());
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};


// get all product for particular category (mobile) 
route.get('/mob/get/productlist/:id', async (req, res) => {
    const categoryId = req.params.id;
    const userId = req?.query?.userId
    const productId = req?.query?.productId

    let user

    if (userId != "0") {
        user = await User.findById(userId);
    }

    try {
        let SimilarProducts = await Product.find({ Category: categoryId, Product_Status: true })
            .limit(10)
            .populate('Category', 'Category_Name')
            .populate({
                path: 'Variation',
                select: '-__v',
            })
        SimilarProducts = SimilarProducts?.filter((product) => product?._id?.toString() !== productId)

        let YouMayAlsoLike = await Product.find({ Product_Status: true })
            .limit(10)
            .populate('Category', 'Category_Name')
            .populate({
                path: 'Variation',
                select: '-__v',
            })
        YouMayAlsoLike = YouMayAlsoLike?.filter((product) => product?._id?.toString() !== productId)

        let ResultSimilarProducts = []
        let ResultYouMayAlsoLike = []

        const userWishlist = await getWishList(userId);

        {
            ResultSimilarProducts = SimilarProducts.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${product?.Product_Image?.path?.replace(/\\/g, '/')}`,
                Category: product.Category?.Category_Name,
                Brand_Name: product?.Brand_Name?.Data_Name,
                Fabric_Type: product?.Fabric_Type?.Data_Name,
                Occasions: product?.Occasions?.Data_Name,

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
                isFavorite: userId == "0" ? false : userWishlist?.includes(product._id?.toString())
            }));
        }

        {
            ResultYouMayAlsoLike = YouMayAlsoLike.map(product => ({
                _id: product._id,
                Product_Name: product.Product_Name,
                SKU_Code: product.SKU_Code,
                Product_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${product?.Product_Image?.path?.replace(/\\/g, '/')}`,
                Category: product.Category?.Category_Name,
                Brand_Name: product?.Brand_Name?.Data_Name,
                Fabric_Type: product?.Fabric_Type?.Data_Name,
                Occasions: product?.Occasions?.Data_Name,

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
                isFavorite: userId == "0" ? false : userWishlist?.includes(product._id?.toString())
            }));
        }
        res.status(200).json({ type: 'success', message: 'Products found successfully!', YouMayAlsoLike: ResultYouMayAlsoLike || [], SimilarProducts: ResultSimilarProducts || [] });

    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error)
    }
});


module.exports = route
