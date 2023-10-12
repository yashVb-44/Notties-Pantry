const express = require('express')
const route = express.Router()
const Cart = require('../../../Models/FrontendSide/cart_model')
const User = require('../../../Models/FrontendSide/user_model')
const { Product, Variation } = require('../../../Models/BackendSide/product_model');
const Shipping = require('../../../Models/BackendSide/shipping_model')
const authMiddleware = require('../../../Middleware/authMiddleWares')

// get shipCharges from Shipping Model
// const getShippingCharges = async (city, userType, totalWeight) => {

//     try {
//         const shippingList = await Shipping.find({ city: { $regex: new RegExp(city, 'i') }, userType: userType })


//         totalWeight = Number(totalWeight)
//         totalWeight = 15

//         // Find the applicable weight range based on totalWeight
//         const applicableWeight = shippingList[0]?.weights?.find(weight => {
//             const range = weight.name.split('-');
//             const min = parseFloat(range[0]);
//             const max = range[1] ? parseFloat(range[1]) : Infinity;

//             return totalWeight >= min && totalWeight <= max;
//         });

//         console.log(applicableWeight?.price, "wirh")

//         return applicableWeight.price;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// };

const getShippingCharges = async (city, userType, totalWeight) => {
    try {
        const shippingList = await Shipping.findOne({ city: { $regex: new RegExp(city, 'i') }, userType: userType });

        totalWeight = Number(totalWeight);

        if (!shippingList) {

            const everywhereShipping = await Shipping.findOne({ type: 'everywhere', userType });

            if (!everywhereShipping) {
                return 50;
            }

            const applicableWeight = everywhereShipping.weights.find(weight => {
                const range = weight.name.split('-');
                const min = parseFloat(range[0]);
                const max = range[1] ? parseFloat(range[1]) : Infinity;
                return totalWeight >= min && totalWeight <= max;
            });

            if (!applicableWeight) {
                return 50;
            }

            return applicableWeight.price;
        }

        const applicableWeight = shippingList?.weights?.find(weight => {
            const range = weight.name.split('-');
            const min = parseFloat(range[0]);
            const max = range[1] ? parseFloat(range[1]) : Infinity;
            return totalWeight >= min && totalWeight <= max;
        });

        if (!applicableWeight) {
            return 50;
        }

        return applicableWeight.price;
    } catch (error) {
        console.error(error);
        return 50;
    }
};

// add cartItems
route.post("/add", authMiddleware, async (req, res) => {

    const userId = req?.user?.userId

    try {

        let { product, quantity, variation, sizeName, total_weight } = req.body
        const Products = await Product.findById(product);
        const Variations = await Variation.findById(variation)
        const user = await User.findById(userId)

        quantity = Number(quantity)
        total_weight = Number(total_weight)
        let old_weight = Number(total_weight)
        total_weight = (total_weight * quantity).toFixed(2);
        total_weight = Number(total_weight)

        if (!Products) {
            return res.status(200).json({
                type: "error",
                message: 'Product not found'
            });
        }

        if (!Variations) {
            return res.status(200).json({
                type: "error",
                message: 'Variation not found'
            });
        }

        let originalPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.Disc_Price || 0;

        let discountPrice;

        if (user?.User_Type === '0' || userId === "0") {
            discountPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.R0_Price || 0;
        } else {
            switch (user?.User_Type) {
                case '1':
                    discountPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.R1_Price || 0;;
                    break;
                case '2':
                    discountPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.R2_Price || 0;
                    break;
                case '3':
                    discountPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.R3_Price || 0;
                    break;
                default:
                    discountPrice = Variations?.Variation_Size?.find(element => sizeName === element?.Size_Name)?.R4_Price || 0;
                    break;
            }
        }

        const existingCartItem = await Cart.findOne({ userId, product, variation, sizeName });

        if (existingCartItem) {

            existingCartItem.quantity = quantity + existingCartItem.quantity;
            existingCartItem.total_weight = total_weight + existingCartItem.total_weight;
            existingCartItem.old_weight = old_weight
            await existingCartItem.save()
            console.log(existingCartItem, "item")
            res.status(200).json({ type: "success", message: "CartItem quantity add successfully!" })
        } else {
            const newCartItem = new Cart({ userId, product, variation, sizeName, quantity, originalPrice, discountPrice, total_weight, old_weight });

            await newCartItem.save();
            res.status(200).json({ type: "success", message: "CartItem add successfully!" })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// get all cartItem (second method)
route.get('/cartItems/get', authMiddleware, async (req, res) => {

    const city = req.query.city

    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId)
        const userType = user?.User_Type
        const cartItems = await Cart.find({ userId }).populate('product').populate({
            path: 'variation',
        })
        if (cartItems?.length <= 0) {
            res.status(200).json({ type: "warning", message: "CartItem Not Found!", cartItems: [] })
        }
        else {
            const result = cartItems.map(cart => ({
                _id: cart?._id,
                userId: cart?.userId || "",
                originalPrice: cart?.originalPrice * cart?.quantity || 0,
                discountPrice: cart?.discountPrice * cart?.quantity || 0,
                quantity: cart?.quantity || 0,
                sizeName: cart?.sizeName || "",
                Stock: cart?.variation?.Variation_Size?.find(size => size?.Size_Name === cart?.sizeName)?.Size_Stock || 0,
                Product: {
                    product_id: cart?.product?._id || "",
                    product_Name: cart?.product?.Product_Name || "",
                },
                Variation: {
                    variation_id: cart?.variation?._id || "",
                    variation_name: cart?.variation?.Variation_Name || "",
                    variation_Image: `${process.env.IMAGE_URL}/${cart?.variation?.Variation_Images?.[0]?.replace(/\\/g, '/')}`
                },
                old_weight: cart?.old_weight || 0,
                total_weight: cart?.total_weight || 0,
                isStorePickup: city?.toLowerCase() === "surat"
            }))

            // Calculate total weight
            let totalWeight = cartItems.reduce((total, cart) => {
                return total + cart?.total_weight || 0;
            }, 0);

            totalWeight = Number(totalWeight).toFixed(2)

            let Charges = await getShippingCharges(city, userType, totalWeight);

            // Calculate total discount
            const totalDiscount = cartItems.reduce((total, cart) => {
                return total + cart?.discountPrice * cart?.quantity || 0;
            }, 0);

            // Calculate total original Amount
            const totalOriginalAmount = cartItems.reduce((total, cart) => {
                return total + cart?.originalPrice * cart?.quantity || 0;
            }, 0);

            // Calculate Shippin Charge
            let ShippingCharge = Charges || 0

            // Calculate total amount
            const SubTotalAmount = cartItems.reduce((total, cart) => {
                return (total + cart?.discountPrice * cart?.quantity)
            }, 0);

            const totalAmount = SubTotalAmount + ShippingCharge

            res.status(200).json({ type: "success", message: "All CartItem get successfully!", totalAmount: totalAmount, totalDiscount: totalDiscount, totalOriginalAmount: totalOriginalAmount, ShippingCharge: ShippingCharge, totalWeight: totalWeight, cartItems: result || [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// get all cartItem by userid (for admin)
route.get('/user/get/cartItems/byAdmin/:userId', async (req, res) => {

    try {
        const userId = req.params?.userId;
        const user = await User.findById(userId)
        const userType = user?.User_Type
        const cartItems = await Cart.find({ userId }).populate('product').populate({
            path: 'variation',
        })
        if (cartItems?.length <= 0) {
            res.status(200).json({ type: "warning", message: "CartItem Not Found!", cartItems: [] })
        }
        else {
            const result = cartItems.map(cart => ({
                _id: cart?._id,
                userId: cart?.userId || "",
                originalPrice: cart?.originalPrice * cart?.quantity || 0,
                discountPrice: cart?.discountPrice * cart?.quantity || 0,
                quantity: cart?.quantity || 0,
                sizeName: cart?.sizeName || "",
                Stock: cart?.variation?.Variation_Size?.find(size => size?.Size_Name === cart?.sizeName)?.Size_Stock || 0,
                Product: {
                    product_id: cart?.product?._id || "",
                    product_Name: cart?.product?.Product_Name || "",
                    SKU_Code: cart?.product?.SKU_Code || "",
                },
                Variation: {
                    variation_id: cart?.variation?._id || "",
                    variation_name: cart?.variation?.Variation_Name || "",
                    variation_Image: `${process.env.IMAGE_URL}/${cart?.variation?.Variation_Images?.[0]?.replace(/\\/g, '/')}`
                },
                old_weight: cart?.old_weight || 0,
                total_weight: cart?.total_weight || 0,
                // isStorePickup: city?.toLowerCase() === "surat"
            }))

            // Calculate total weight
            let totalWeight = cartItems.reduce((total, cart) => {
                return total + cart?.total_weight || 0;
            }, 0);

            totalWeight = Number(totalWeight).toFixed(2)

            let Charges = 0

            // Calculate total discount
            const totalDiscount = cartItems.reduce((total, cart) => {
                return total + cart?.discountPrice * cart?.quantity || 0;
            }, 0);

            // Calculate total original Amount
            const totalOriginalAmount = cartItems.reduce((total, cart) => {
                return total + cart?.originalPrice * cart?.quantity || 0;
            }, 0);

            // Calculate Shippin Charge
            let ShippingCharge = Charges || 0

            // Calculate total amount
            const SubTotalAmount = cartItems.reduce((total, cart) => {
                return (total + cart?.discountPrice * cart?.quantity)
            }, 0);

            const totalAmount = SubTotalAmount + ShippingCharge

            res.status(200).json({ type: "success", message: "All CartItem get successfully!", totalAmount: totalAmount, totalDiscount: totalDiscount, totalOriginalAmount: totalOriginalAmount, ShippingCharge: ShippingCharge, totalWeight: totalWeight, cartItems: result || [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// update the cart item quantity 
route.put('/cartItems/update/:cartItemId', authMiddleware, async (req, res) => {

    const cartItemId = req.params.cartItemId;
    let { quantity, old_weight } = req.body;

    let total_weight = 0
    console.log(total_weight, "init")

    quantity = Number(quantity)
    total_weight = Number(total_weight)
    old_weight = Number(old_weight)
    total_weight = (old_weight * quantity).toFixed(2);
    total_weight = Number(total_weight)

    console.log(quantity, "quan")
    console.log(total_weight, "total")

    try {

        const updatedCartItem = await Cart.findByIdAndUpdate(
            cartItemId,
            { $set: { quantity: quantity, total_weight: total_weight } },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(200).json({ type: "error", message: "CartItem Not Found!" })
        }

        res.status(200).json({ type: "success", message: "CartItem update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// remove or delete item on cart
route.delete('/cartItems/delete/:id', authMiddleware, async (req, res) => {
    const cartItemId = await req.params.id
    const userId = req.user.userId;
    try {
        const result = await Cart.findByIdAndDelete({ _id: cartItemId, userId })
        if (!result) {
            return res.status(200).json({ type: "error", message: "Item not found!" })
        }
        res.status(200).json({ type: "success", message: "Item Remove Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

// delete or remove all cart
route.delete('/cartItems/delete', async (req, res) => {

    try {
        await Cart.deleteMany()
        res.status(200).json({ type: "error", message: "All Item deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})





module.exports = route