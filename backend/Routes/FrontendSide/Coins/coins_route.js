const express = require('express')
const route = express.Router()
const Order = require('../../../Models/FrontendSide/order_model')
const Cart = require('../../../Models/FrontendSide/cart_model')
const { Variation } = require('../../../Models/BackendSide/product_model')
const Wallet = require('../../../Models/FrontendSide/wallet_model')
const User = require('../../../Models/FrontendSide/user_model')
const Coupon = require('../../../Models/FrontendSide/coupon_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const Coins = require('../../../Models/FrontendSide/coins_model')
const Settings = require('../../../Models/Settings/general_settings_model')


// withdrawal coin in wallet
route.post('/withdrawal', authMiddleWare, async (req, res) => {

    try {
        const userId = req.user.userId;
        let { amount } = req.body;
        const user = await User.findById(userId);
        const settings = await Settings.find()

        amount = Number(amount)
        amount = Math.floor(amount)

        if (!user) {
            return res.status(200).json({ type: 'error', message: 'User not found.' });
        }

        const coinsConvert = (settings?.[0]?.price_convert_coin)
        const newAmount = Math.floor(amount / coinsConvert)

        // Create a new coupon
        const newCoinsRecord = new Coins({
            userId: userId,
            Amount: amount,
            Description: `Your ${amount} coins have been converted to your wallet balance. Refer more to earn more coins.`,
            Type: '1',
            Trans_Type: 'Debit',
        });
        await newCoinsRecord.save();
        user.Coins -= amount;

        const newWallte = await new Wallet({
            Amount: newAmount || 0,
            userId,
            Trans_Type: "Credit",
            Description: `Congratulations! Your earned Coins ${amount} have been successfully converted to your wallet as Rs.${newAmount}.`,
            Type: "2"
        })

        user.Wallet = await user?.Wallet + amount;

        await newWallte.save()

        await user.save();

        res.status(200).json({ type: 'success', message: 'Coins withdrawal successfully.' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Internal server error.' });
        console.log(error);
    }
});


// add coins history by admin
route.post("/add/byadmin", async (req, res) => {
    let { amount, transType, userId, paymentId } = req.body;
    amount = Number(amount)
    amount = Math.floor(amount)

    let desc
    let type
    if (transType === "Credit") {
        type = "4"
        desc = `Greetings! You earned ${amount} coins by Budai Exclusive.`
    }
    else {
        type = "3"
        desc = `Your ${amount} coins has been debited by Budai Exclusive.`
    }

    try {
        const user = await User.findById(userId)
        const userType = user?.User_Type
        const newUser = await User.findByIdAndUpdate(userId);

        const newCoins = await new Coins({
            Amount: amount || 0,
            userId,
            paymentId: paymentId || "",
            Trans_Type: transType,
            Description: desc || "",
            Type: type
        })

        if (transType === "Credit") {
            newUser.Coins = await newUser?.Coins + amount;
        }
        else {
            newUser.Coins = await newUser?.Coins - amount;
        }

        await newUser.save();
        await newCoins.save()

        res.status(200).json({ type: "success", message: "Coins history added successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get All Coins history
route.get('/get', async (req, res) => {
    try {
        const coins = await Coins.find().populate({
            path: 'userId',
            model: 'Users',
            select: 'User_Name User_Mobile_No'
        }).sort({ createdAt: -1 })

        if (coins.length === 0) {
            return res.status(200).json({ type: "error", message: 'No coins transactions found', coupon: [] });
        }

        const populatedCoins = coins.map(coin => {
            let Type = '';
            if (coin.Type === "0") {
                Type = 'Reward At Order Time';
            } else if (coin.Type === "1") {
                Type = 'Coins Withdrawal';
            } else if (coin.Type === "2") {
                Type = 'Reward At Review Time';
            } else if (coin.Type === "3") {
                Type = 'Admin Debit';
            } else if (coin.Type === "4") {
                Type = 'Admin Credit';
            }

            return {
                ...coin.toObject(),
                Type: Type,
                User_Name: coin?.userId?.User_Name || "",
                User_Mobile_No: coin?.userId?.User_Mobile_No || "",
                Date: new Date(coin?.createdAt)?.toLocaleDateString('en-IN'),
                Time: new Date(coin?.createdAt)?.toLocaleTimeString('en-IN', { hour12: true }),
            };
        });

        res.status(200).json({ type: "success", message: " Wallet found successfully!", coins: populatedCoins || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});


// get All Wallet history fot particular user
route.get('/user/get', authMiddleWare, async (req, res) => {

    const userId = await req?.user?.userId

    try {
        const coins = await Coins.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json({ type: "success", message: " Coins found successfully!", coins: coins || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});


// delete all coins history
route.delete('/delete', async (req, res) => {

    try {
        const coins = await Coins.find();

        await Coins.deleteMany()
        res.status(200).json({ type: "error", message: "All Coins History deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// delete order by id
route.delete('/delete/:id', async (req, res) => {
    const coinId = await req.params.id
    try {
        const result = await Coins.findByIdAndDelete(coinId)
        if (!result) {
            res.status(200).json({ type: "error", message: "Coins history not found!" })
        }
        res.status(200).json({ type: "error", message: "Coins history deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

// delete many wallet
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        await Coins.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Coins history deleted Successfully!" })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});


module.exports = route