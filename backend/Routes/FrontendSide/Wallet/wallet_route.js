const express = require('express')
const route = express.Router()
const User = require('../../../Models/FrontendSide/user_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const fs = require('fs');
const path = require('path')
const Wallet = require('../../../Models/FrontendSide/wallet_model')
const MemberShipHistory = require('../../../Models/BackendSide/memberShipHistory_model')

// funcation for increment the end date of active membership
// async function incrementDateOfMembership(userId) {
//     console.log(userId)
//     try {
//         const memberShipHistory = await MemberShipHistory.findOne({ UserId: userId })

//         if (memberShipHistory) {
//             const latestMembership = memberShipHistory?.MemberShipData[0];
//             if (latestMembership) {
//                 const endDate = new Date(latestMembership.MemberShip.endDate);
//                 endDate.setMonth(endDate.getMonth() + 2);
//                 console.log(endDate)

//                 latestMembership.MemberShip.endDate = endDate;
//                 await memberShipHistory.save();
//                 console.log(memberShipHistory?.MemberShipData[0]?.MemberShip?.endDate)
//             }
//         }
//     } catch (error) {
//         console.error("Error incrementing membership end date:", error);
//     }
// }

async function incrementDateOfMembership(userId) {
    try {
        const memberShipHistory = await MemberShipHistory.findOne({ UserId: userId });
        if (memberShipHistory) {
            // Find the latest MemberShipData entry
            const latestMemberShip = memberShipHistory.MemberShipData[0];
            if (latestMemberShip) {
                const currentEndDate = new Date(latestMemberShip.MemberShip.endDate);
                const newEndDate = new Date(currentEndDate.getFullYear(), currentEndDate.getMonth() + 2, currentEndDate.getDate());

                // Update the latest MemberShipData entry with the new endDate
                await MemberShipHistory.updateOne(
                    { _id: memberShipHistory._id, 'MemberShipData._id': latestMemberShip._id },
                    { $set: { 'MemberShipData.$.MemberShip.endDate': newEndDate } }
                );
            }
        }
    } catch (error) {
        console.error('Error updating membership end date:', error);
    }
}

// add wallet history 
route.post("/mob/add", authMiddleWare, async (req, res) => {
    const userId = req.user.userId;
    let { amount, paymentId } = req.body;
    amount = Number(amount)
    amount = Math.floor(amount)

    let desc = `You have added Rs.${amount} to your wallet’s balance.`

    try {
        const user = await User.findById(userId)
        const userType = user?.User_Type
        const newUser = await User.findByIdAndUpdate(userId);

        const newWallte = await new Wallet({
            Amount: amount || 0,
            userId,
            paymentId: paymentId || "",
            Trans_Type: "Credit",
            Description: desc || "",
            Type: "0"
        })

        newUser.Wallet = await newUser?.Wallet + amount;

        await newUser.save();
        await newWallte.save()
        if (userType !== "0") {
            await incrementDateOfMembership(userId)
        }
        res.status(200).json({ type: "success", message: "wallet history add successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});


// add wallet history by admin
route.post("/add/byadmin", async (req, res) => {
    let { amount, transType, userId, paymentId } = req.body;
    amount = Number(amount)
    amount = Math.floor(amount)

    let desc
    let type
    if (transType === "Credit") {
        type = "5"
        desc = `Greetings! Budai Exclusive has credited your wallet with Rs.${amount}`
    }
    else {
        type = "4"
        desc = `Your wallet’s balance has been debited with Rs.${amount} for Budai Exclusive.`
    }

    try {
        const user = await User.findById(userId)
        const userType = user?.User_Type
        const newUser = await User.findByIdAndUpdate(userId);

        const newWallte = await new Wallet({
            Amount: amount || 0,
            userId,
            paymentId: paymentId || "",
            Trans_Type: transType,
            Description: desc || "",
            Type: type
        })

        if (transType === "Credit") {
            newUser.Wallet = await newUser?.Wallet + amount;
        }
        else {
            newUser.Wallet = await newUser?.Wallet - amount;
        }

        await newUser.save();
        await newWallte.save()
        if (userType !== "0") {
            await incrementDateOfMembership(userId)
        }
        res.status(200).json({ type: "success", message: "wallet history added successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get All Wallet history
route.get('/get', async (req, res) => {
    try {
        const wallets = await Wallet.find().populate({
            path: 'userId',
            model: 'Users',
            select: 'User_Name User_Mobile_No'
        }).sort({ createdAt: -1 })

        if (wallets.length === 0) {
            return res.status(200).json({ type: "error", message: 'No wallets transactions found', coupon: [] });
        }

        const populatedWallet = wallets.map(wallet => {
            let Type = '';
            if (wallet.Type === "0") {
                Type = 'Wallet Transfer';
            } else if (wallet.Type === "1") {
                Type = 'Become A Reseller';
            } else if (wallet.Type === "2") {
                Type = 'Convert Coins to Wallet';
            } else if (wallet.Type === "3") {
                Type = 'Use At Order time';
            } else if (wallet.Type === "4") {
                Type = 'Admin Debit';
            } else if (wallet.Type === "5") {
                Type = 'Admin Credit';
            }

            return {
                ...wallet.toObject(),
                Type: Type,
                User_Name: wallet?.userId?.User_Name,
                User_Mobile_No: wallet?.userId?.User_Mobile_No,
                Date: new Date(wallet?.createdAt)?.toLocaleDateString('en-IN'),
                Time: new Date(wallet?.createdAt)?.toLocaleTimeString('en-IN', { hour12: true }),
            };
        });

        res.status(200).json({ type: "success", message: " Wallet found successfully!", wallet: populatedWallet || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});


// get All Wallet history fot particular user
route.get('/user/get', authMiddleWare, async (req, res) => {

    const userId = await req?.user?.userId

    try {
        const wallet = await Wallet.find({ userId: userId }).sort({ createdAt: -1 });
        const newWallet = wallet?.map(wallet => ({
            ...wallet.toObject(),
            Amount: Math.floor(wallet?.Amount) || 0
        }))
        res.status(200).json({ type: "success", message: " Wallet found successfully!", wallet: newWallet || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// delete all wallet history
route.delete('/delete', async (req, res) => {

    try {
        const wallet = await Wallet.find();

        await Wallet.deleteMany()
        res.status(200).json({ type: "error", message: "All Wallet History deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// delete order by id
route.delete('/delete/:id', async (req, res) => {
    const walletId = await req.params.id
    try {
        const result = await Wallet.findByIdAndDelete(walletId)
        if (!result) {
            res.status(200).json({ type: "error", message: "Wallet history not found!" })
        }
        res.status(200).json({ type: "error", message: "Wallet history deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

// delete many wallet
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        await Wallet.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Wallet history deleted Successfully!" })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});




module.exports = route

