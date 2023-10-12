const express = require('express');
const route = express.Router();
const Order = require('../../../Models/FrontendSide/order_model');
const User = require('../../../Models/FrontendSide/user_model');
const Coins = require('../../../Models/FrontendSide/coins_model');
const Review = require('../../../Models/FrontendSide/review_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const Settings = require('../../../Models/Settings/general_settings_model')
const cron = require('node-cron');


async function addCoins(userId, amount, rating) {

    try {
        if (rating >= "5") {
            const user = await User.findById(userId);

            amount = Number(amount)

            // Create a new coupon
            const newCoinsRecord = new Coins({
                userId: userId,
                Amount: amount,
                Description: `Congratulations! You've earned ${amount} coins for rating our product with 5 stars. Thank you for your valuable feedback and support. Keep enjoying our products and earning more rewards!`,
                Type: '2',
                Trans_Type: 'Credit',
            });
            await newCoinsRecord.save();
            user.Coins += amount;

            await user.save();
        }
    } catch (error) {
        console.log(error);
    }
}

// Create review
route.post('/add', authMiddleWare, async (req, res) => {
    try {
        const userId = req?.user?.userId

        const { order, comment, text, rating } = req.body

        const ordersWithProduct = await Order.findById(order)

        const productIds = ordersWithProduct.cartData.map(item => item.product._id?.toString());

        const review = await new Review({
            user: userId,
            order,
            comment,
            text,
            rating,
            productIds
        });

        await review.save()

        const settings = await Settings.find()

        let amount = settings?.[0]?.review_reward_amount
        await addCoins(userId, amount, rating)
        res.status(200).json({ type: "success", message: "Review add successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Get all reviews
route.get('/get/all', async (req, res) => {
    try {
        const reviews = await Review.find().populate({
            path: 'user',
            model: 'Users',
            select: 'User_Name User_Image User_Mobile_No'
        }).sort({ createdAt: -1 })


        const populatedReview = reviews.map(review => {

            return {
                ...review.toObject(),
                createdAt: new Date(review?.createdAt)?.toLocaleDateString('en-IN'),
                Time: new Date(review?.createdAt)?.toLocaleTimeString('en-IN', { hour12: true }),
                User_Name: review?.user?.User_Name,
                // User_Image: `${process.env.IMAGE_URL}/${review?.user?.User_Image?.path?.replace(/\\/g, '/')}`,
                User_Mobile_No: review?.user?.User_Mobile_No,
            };
        })

        res.status(200).json({ type: "success", message: "Reviews Get successfully!", reviews: populatedReview || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// Get all reviews for mobile
route.get('/mob/get/all', async (req, res) => {
    try {
        const reviews = await Review.find({ status: true }).populate({
            path: 'user',
            model: 'Users',
            select: 'User_Name User_Image User_Mobile_No'
        }).sort({ createdAt: -1 })

        if (reviews.length <= 0) {
            return res.status(200).json({ type: "success", message: "Reviews Not Found!", reviews: [] })
        }

        const populatedReview = reviews.map(review => {

            return {
                ...review.toObject(),
                createdAt: new Date(review?.createdAt)?.toLocaleDateString('en-IN'),
                Time: new Date(review?.createdAt)?.toLocaleTimeString('en-IN', { hour12: true }),
                User_Name: review?.user?.User_Name,
                User_Image: `${process.env.IMAGE_URL}/${review?.user?.User_Image?.path?.replace(/\\/g, '/')}` || "",
                User_Mobile_No: review?.user?.User_Mobile_No,
            };
        })

        res.status(200).json({ type: "success", message: "Reviews Get successfully!", reviews: populatedReview || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// Get single review by ID
route.get('/get/single/:id', authMiddleWare, async (req, res) => {
    try {
        const orderId = req.params.id;

        const review = await Review.findOne({ order: orderId })

        if (!review) {
            return res.status(200).json({ type: "error", message: "Review not found" });
        }

        res.status(200).json({ type: "success", message: "Reviews Get successfully!", reviews: [review] || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

route.get('/get/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        const reviewsForProduct = await Review.find({
            productIds: productId
        }).populate('user', 'User_Name User_Image');

        const reviewsWithUser = reviewsForProduct.map(review => ({
            ...review._doc,
            User_Name: review?.user?.User_Name,
            // User_Image: review.user.User_Image,
            User_Image: `${process.env.IMAGE_URL}/${review?.user?.User_Image?.path?.replace(/\\/g, '/')}`,
        }));

        // Remove the user field from each review
        reviewsWithUser.forEach(review => {
            delete review?.user;
        });

        res.status(200).json({ type: 'success', message: 'Reviews Get successfully!', reviews: reviewsWithUser || [] });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error);
    }

});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const reviewId = await req.params.id

    try {
        const { status } = req.body

        const newReview = await Review.findByIdAndUpdate(reviewId)
        newReview.status = await status
        await newReview.save()
        res.status(200).json({ type: "success", message: "Review Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})


module.exports = route