const express = require('express')
const route = express.Router()
const multer = require('multer')
const CustomerSupport = require('../../../Models/FrontendSide/customer_support_model');
const fs = require('fs');
const path = require('path');
const authMiddleWare = require('../../../Middleware/authMiddleWares')

// Set up multer storage and limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imageUploads/frontend/customersupport");
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
});

const upload = multer({ storage: storage })


// Create Feedback
route.post("/add", authMiddleWare, upload.single('image'), async (req, res) => {
    const userId = req?.user?.userId
    try {
        const {
            subject,
            comment,
            orderId
        } = req.body;

        const newCustomerSupport = await new CustomerSupport({
            subject,
            comment,
            orderId,
            solution: "",
            user: userId,
        });

        await newCustomerSupport.save();

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${subject.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/customersupport/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            newCustomerSupport.image = imagePath;
            await newCustomerSupport.save();

            return res.status(200).json({ type: 'success', message: 'Feedback added successfully!' });
        } else {
            return res.status(200).json({ type: 'success', message: 'Feedback added successfully!' });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Failed to add Feedback" });
    }
});

// get all Feedback
route.get('/get/all', async (req, res) => {
    try {
        const newCustomerSupport = await CustomerSupport.find().sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'User_Name User_Mobile_No',
            })
        if (newCustomerSupport) {
            const result = newCustomerSupport.map(requirement => {
                return {
                    ...requirement.toObject(),
                    CustomerSupport_Images: `${process.env.IMAGE_URL}/${requirement?.image?.replace(/\\/g, '/')}`,
                    User_Mobile_No: requirement?.user?.User_Mobile_No,
                    User_Name: requirement?.user?.User_Name,
                    Date: new Date(requirement?.createdAt)?.toLocaleDateString(),
                }
            })
            return res.status(200).json({ type: "success", message: "CustomerSupport found successfully!", customerSupport: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get all Feedback for user
route.get('/mob/get/all', authMiddleWare, async (req, res) => {

    const user = req.user.userId

    try {
        const newCustomerSupport = await CustomerSupport.find({ user: user }).sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'User_Name User_Mobile_No',
            })
        if (newCustomerSupport) {
            const result = newCustomerSupport.map(requirement => {
                return {
                    ...requirement.toObject(),
                    CustomerSupport_Images: `${process.env.IMAGE_URL}/${requirement?.image?.replace(/\\/g, '/')}`,
                    User_Mobile_No: requirement?.user?.User_Mobile_No,
                    User_Name: requirement?.user?.User_Name,
                    Date: new Date(requirement?.createdAt)?.toLocaleDateString(),
                }
            })
            return res.status(200).json({ type: "success", message: "CustomerSupport found successfully!", customerSupport: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all Feedback
route.delete('/delete/all', async (req, res) => {
    try {
        const newCustomerSupport = await CustomerSupport.find();

        for (const Feedback of newCustomerSupport) {
            try {
                if (Feedback.image && fs.existsSync(Feedback.image)) {
                    fs.unlinkSync(Feedback.image);
                }
            } catch (error) {

            }
        }

        await CustomerSupport.deleteMany();
        res.status(200).json({ type: "success", message: "All Feedback deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many Feedback
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const newCustomerSupport = await CustomerSupport.find({ _id: { $in: ids } });

        for (const Feedback of newCustomerSupport) {
            try {
                if (Feedback.image && fs.existsSync(Feedback.image)) {
                    fs.unlinkSync(Feedback.image);
                }
            } catch (error) {

            }
        }

        await CustomerSupport.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected Feedback deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete Feedback by ID
route.delete('/delete/:id', async (req, res) => {
    const feedbackId = req.params.id;
    try {
        const Feedback = await CustomerSupport.findById(feedbackId);
        if (!Feedback) {
            return res.status(404).json({ type: "warning", message: "Feedback not found!" });
        }

        try {
            if (Feedback.image && fs.existsSync(Feedback.image)) {
                fs.unlinkSync(Feedback.image);
            }
        } catch (error) {

        }

        await CustomerSupport.findByIdAndDelete(feedbackId);
        res.status(200).json({ type: "success", message: "Feedback deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update feedback solution
route.patch("/update/solution/:id", async (req, res) => {

    const Id = await req.params.id

    try {
        const { solution } = req.body

        const newCustomerSupport = await CustomerSupport.findByIdAndUpdate(Id)

        newCustomerSupport.solution = await solution
        await newCustomerSupport.save()
        res.status(200).json({ type: "success", message: "Feedback solution update successfully!", solution: solution })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }

})


module.exports = route