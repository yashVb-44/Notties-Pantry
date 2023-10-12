const express = require('express')
const route = express.Router()
const multer = require('multer')
const Shipping = require('../../../Models/BackendSide/shipping_model')
const fs = require('fs');

// Create Shipping Charges
route.post('/add', async (req, res) => {
    try {
        const {
            type, userType, state, city,
            w0, w1, w2, w3, w4, w5, w6, w7, w8, w9,
            w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20
        } = req.body;

        const weights = [
            { name: "0-1 Kg", price: w0 },
            { name: "1-2 Kg", price: w1 },
            { name: "2-3 Kg", price: w2 },
            { name: "3-4 Kg", price: w3 },
            { name: "4-5 Kg", price: w4 },
            { name: "5-6 Kg", price: w5 },
            { name: "6-7 Kg", price: w6 },
            { name: "7-8 Kg", price: w7 },
            { name: "8-9 Kg", price: w8 },
            { name: "9-10 Kg", price: w9 },
            { name: "10-11 Kg", price: w10 },
            { name: "11-12 Kg", price: w11 },
            { name: "12-13 Kg", price: w12 },
            { name: "13-14 Kg", price: w13 },
            { name: "14-15 Kg", price: w14 },
            { name: "15-16 Kg", price: w15 },
            { name: "16-17 Kg", price: w16 },
            { name: "17-18 Kg", price: w17 },
            { name: "18-19 Kg", price: w18 },
            { name: "19-20 Kg", price: w19 },
            { name: "20+ Kg", price: w20 },
        ]

        const shipping = new Shipping({
            type,
            userType,
            state,
            city,
            weights
        });

        await shipping.save();

        res.status(200).json({ type: 'success', message: 'Shipping charges added successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: 'error', message: 'Server Error', errorMessage: error.message });
    }
});

// get all Shipping
route.get('/get/all', async (req, res) => {

    try {
        let shippings = await Shipping.find().sort({ createdAt: -1 })

        const modifiedShipping = shippings.map(shipping => {

            let UserType = '';
            if (shipping.userType === "0") {
                UserType = 'User';
            }
            else if (shipping.userType === "1") {
                UserType = 'R1';
            } else if (shipping.userType === "2") {
                UserType = 'R2';
            } else if (shipping.userType === "3") {
                UserType = 'R3';
            } else if (shipping.userType === "4") {
                UserType = 'R4';
            }

            let type = ""
            if (shipping.type === "everywhere") {
                type = 'Everywhere';
            }
            else {
                type = 'Specific'
            }


            return {
                ...shipping.toObject(),
                UserType: UserType,
                Type: type
            };
        });

        res.status(200).json({ type: "success", message: "All Shipping get Successfully!", shippingList: modifiedShipping || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// get single shipping by shippingId
route.get('/get/single/:shippingId', async (req, res) => {
    try {
        const shippingId = req.params.shippingId;

        const shipping = await Shipping.findById(shippingId)

        if (!shipping) {
            return res.status(404).json({ type: 'error', message: 'Shipping Charges not found' });
        }

        const UserTypeMap = {
            "0": "User",
            "1": 'R1',
            "2": 'R2',
            "3": 'R3',
            "4": 'R4',
        };

        const modifiedShipping = {
            ...shipping.toObject(),
            UserType: UserTypeMap[shipping.UserType] || '',
        };

        res.status(200).json({ type: 'success', message: 'Shipping retrieved successfully', shipping: modifiedShipping || {} });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
        console.log(error);
    }
});


// Delete many Shipping Charges
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const shipping = await Shipping.find({ _id: { $in: ids } });
        await Shipping.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Shipping charges deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// Delete data by ID
route.delete('/delete/:id', async (req, res) => {
    const shippingId = req.params.id;
    try {
        await Shipping.findByIdAndDelete(shippingId);
        res.status(200).json({ type: "success", message: "Shipping charges deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Update Shipping
route.patch('/update/:id', async (req, res) => {
    try {
        const shippingId = req.params.id;
        const { w0, w1, w2, w3, w4, w5, w6, w7, w8, w9,
            w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20
        } = req.body;

        const shipping = await Shipping.findById(shippingId);
        if (!shipping) {
            return res.status(404).json({ type: "warning", message: "Shipping charge does not exist!" });
        }

        shipping.weights[0].price = w0
        shipping.weights[1].price = w1
        shipping.weights[2].price = w2
        shipping.weights[3].price = w3
        shipping.weights[4].price = w4
        shipping.weights[5].price = w5
        shipping.weights[6].price = w6
        shipping.weights[7].price = w7
        shipping.weights[8].price = w8
        shipping.weights[9].price = w9
        shipping.weights[10].price = w10
        shipping.weights[11].price = w11
        shipping.weights[12].price = w12
        shipping.weights[13].price = w13
        shipping.weights[14].price = w14
        shipping.weights[15].price = w15
        shipping.weights[16].price = w16
        shipping.weights[17].price = w17
        shipping.weights[18].price = w18
        shipping.weights[19].price = w19
        shipping.weights[20].price = w20

        await shipping.save();
        res.status(200).json({ type: "success", message: "Shipping charge updated successfully!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});



module.exports = route;