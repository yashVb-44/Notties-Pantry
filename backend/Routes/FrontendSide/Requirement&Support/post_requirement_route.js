const express = require('express')
const route = express.Router()
const multer = require('multer')
const PostRequirement = require('../../../Models/FrontendSide/post_requirement_model');
const fs = require('fs');
const path = require('path');
const authMiddleWare = require('../../../Middleware/authMiddleWares')

// Set up multer storage and limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imageUploads/frontend/requirement");
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split(".").pop();
        cb(null, `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`);
    },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });


// Create requirement
route.post("/add", authMiddleWare, upload.array("images", 10), async (req, res) => {
    const userId = req?.user?.userId
    try {
        const {
            title,
            desc,
        } = req.body;

        // Assuming PostRequirement is a Mongoose model
        const newRequirement = await new PostRequirement({
            title,
            desc,
            user: userId,
            images: req.files.map(file => file.path),
        });

        // Save the new requirement
        await newRequirement.save();

        res.status(200).json({ type: "success", message: "Requirement added successfully!" });
    } catch (error) {
        console.error("Failed to add requirement:", error);
        res.status(500).json({ type: "error", message: "Failed to add requirement" });
    }
});

// get all Requirement
route.get('/get/all', async (req, res) => {
    try {
        const Requirement = await PostRequirement.find().sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'User_Name User_Mobile_No',
            })
        if (Requirement) {
            const result = Requirement.map(requirement => {
                return {
                    ...requirement.toObject(),
                    Requirement_Images: requirement?.images?.map(image => `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`),
                    User_Mobile_No: requirement?.user?.User_Mobile_No,
                    User_Name: requirement?.user?.User_Name,
                    Date: new Date(requirement?.createdAt)?.toLocaleDateString(),
                }
            })
            return res.status(200).json({ type: "success", message: " Requirement found successfully!", requirement: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all requirements
route.delete('/delete/all', async (req, res) => {
    try {

        const requirements = await PostRequirement.find();

        for (const requirement of requirements) {
            for (const image of requirement?.images) {
                try {
                    if (fs.existsSync(image)) {
                        fs.unlinkSync(image);
                    }
                } catch (error) {

                }
            }
        }

        await PostRequirement.deleteMany();

        res.status(200).json({ type: "success", message: "All Variations deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete requirement by ID
route.delete('/delete/:id', async (req, res) => {
    const requirementiD = req.params.id;
    try {
        const requirement = await PostRequirement.findById(requirementiD);
        if (!requirement) {
            return res.status(404).json({ type: "error", message: "PostRequirement not found!" });
        }

        // Delete the requirement images from the folder
        for (const image of requirement.images) {
            try {
                if (fs.existsSync(image?.images)) {
                    fs.unlinkSync(image?.images);
                }
            } catch (error) {
                return res.status(500).json({ type: "error", message: "Error deleting image", errorMessage: error });
            }
        }

        await PostRequirement.findByIdAndDelete(requirementiD);
        res.status(200).json({ type: "success", message: "PostRequirement deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple requirements by IDs
route.delete('/deletes', async (req, res) => {
    const { ids } = req.body;
    try {
        const requirements = await PostRequirement.find({ _id: { $in: ids } });

        // Delete images from the folder for each requirement
        requirements.forEach((requirement) => {
            requirement?.images?.forEach((image) => {
                try {
                    if (fs.existsSync(image?.images)) {
                        fs.unlinkSync(image?.images);
                    }
                } catch (error) {
                    return res.status(500).json({ type: "error", message: "Error deleting image", errorMessage: error });
                }
            });
        });

        // Delete the requirements from the database
        await PostRequirement.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ type: "success", message: "PostRequirement deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

module.exports = route