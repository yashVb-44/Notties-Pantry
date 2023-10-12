const express = require('express');
const route = express.Router();
const Wishlist = require('../../../Models/FrontendSide/wish_list_model');
const User = require('../../../Models/FrontendSide/user_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares');
const { Variation } = require('../../../Models/BackendSide/product_model');

// Add and Remove product to wishlist
route.post('/addremove', authMiddleWare, async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    try {
        const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });

        if (existingWishlistItem) {
            await Wishlist.findByIdAndDelete(existingWishlistItem._id);
            res.status(200).json({ type: 'success', message: 'Product removed from wishlist successfully' });
        } else {
            const wishlistItem = new Wishlist({
                user: userId,
                product: productId,
            });

            await wishlistItem.save();
            res.status(200).json({ type: 'success', message: 'Product added to wishlist successfully' });
        }
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// Remove product from wishlist
route.delete('/remove/:prodcutId', authMiddleWare, async (req, res) => {
    const userId = req?.user?.userId
    const productId = req?.params?.prodcutId;

    try {
        await Wishlist.findOneAndDelete({ user: userId, product: productId });
        res.status(200).json({ type: 'success', message: 'Product removed from wishlist successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error)
    }
});

// Get user's wishlist
route.get('/get', authMiddleWare, async (req, res) => {
    const userId = req.user?.userId;

    try {
        const user = await User.findOne({ _id: userId });

        async function getPrices(variationId) {
            const variation = await Variation.findById(variationId);
            const originalPrice = variation?.Variation_Size?.[0]?.Disc_Price;

            const discountPrice = (user?.User_Type === '0' || userId === "0"
                ? variation?.Variation_Size?.[0]?.R0_Price
                : (user?.User_Type === '1' ? variation?.Variation_Size?.[0]?.R1_Price :
                    (user?.User_Type === '2' ? variation?.Variation_Size?.[0]?.R2_Price :
                        (user?.User_Type === '3' ? variation?.Variation_Size?.[0]?.R3_Price :
                            variation?.Variation_Size?.[0]?.R4_Price
                        )
                    )
                )
            );

            return {
                originalPrice,
                discountPrice
            };
        }

        const wishlistItems = await Wishlist.find({ user: userId })
            .populate('product')
            .sort({ createdAt: -1 });

        // Use Promise.all to handle asynchronous calls
        const wishlistProducts = await Promise.all(wishlistItems.map(async item => {
            const product = item?.product;

            const prices = await getPrices(product?.Variation?.[0]);

            return {
                _id: product?._id,
                Product_Name: product?.Product_Name,
                Product_Image: `${process.env.IMAGE_URL}/${product?.Product_Image?.replace(/\\/g, '/')}`,
                Product_Ori_Price: prices.originalPrice || 0,
                Product_Dis_Price: prices.discountPrice || 0,
                isFavorite: true
            };
        }));

        res.status(200).json({ type: 'success', message: 'User wishlist fetched successfully', wishlist: wishlistProducts || [] });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error)
    }
});


// Delete users Wish List  
route.delete('/delete', authMiddleWare, async (req, res) => {
    const userId = req.user.userId;

    try {
        const existingWishlistItems = await Wishlist.find({ user: userId });

        if (existingWishlistItems.length === 0) {
            return res.status(200).json({ type: 'warning', message: 'No wishlist items found for the user' });
        }

        await Wishlist.deleteMany({ user: userId });
        res.status(200).json({ type: 'success', message: 'User wishlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});

// Delete all Wish List
route.delete('/delete/all', async (req, res) => {
    try {
        await Wishlist.deleteMany();
        res.status(200).json({ type: 'success', message: 'All wishlists deleted successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
    }
});




module.exports = route