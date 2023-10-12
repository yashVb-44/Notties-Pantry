const express = require('express')
const route = express.Router()
const User = require('../../../Models/FrontendSide/user_model')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const fs = require('fs');
const path = require('path')
const Wallet = require('../../../Models/FrontendSide/wallet_model')


// function for add wallet history
async function addWalletHistory(userId, orderId, FinalPrice, type) {
    const wallet = await new Wallet({
        Amount: FinalPrice || 0,
        userId: userId,
        paymentId: orderId || "",
        Trans_Type: "Credit",
        Description: `Greetings for becoming Budai Exclusive ${type == 1 ? 'GOLD' : type == 2 ? 'SILVER' : 'PPO'} reseller, Rs.${FinalPrice} has been credited in your wallet.`,
        Type: "1"
    })

    await wallet.save()
}

// update reseller memeber ship status 
route.post("/update/usertype", authMiddleWare, async (req, res) => {
    const userId = req.user.userId;
    const updateStatus = req.body?.updateStatus;
    let amount = req.body?.amount;
    let paymentId = req.body?.paymentId;
    amount = Number(amount)

    try {
        const newUser = await User.findByIdAndUpdate(userId);
        newUser.User_Type = await updateStatus;
        newUser.Wallet = await newUser?.Wallet + amount;

        await newUser.save();
        addWalletHistory(userId, paymentId, amount, updateStatus)
        res.status(200).json({ type: "success", message: "User Status update successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});


module.exports = route

