const express = require('express')
const route = express.Router()
const multer = require('multer')
const Notifly = require('../../../Models/BackendSide/notifly_model')
const fs = require('fs');
const { formatDistanceToNow } = require('date-fns');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/nottifly')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Notifly
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { desc, product, fileType } = req.body;

        const notifly = new Notifly({
            desc,
            product,
            fileType
        });

        await notifly.save();

        const random = Math.random() * 1000;
        const notiflyTitle = `nottifly${random}`

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${notiflyTitle.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/nottifly/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            if (fileType === 'image') {
                notifly.fileUrl = imagePath;
            }
            await notifly.save();
        }
        else if (fileType === 'video') {
            notifly.fileUrl = req.body.fileUrl;
            await notifly.save();
        }

        return res.status(200).json({ type: 'success', message: 'Nottifly added successfully!' });

    } catch (error) {
        try {
            if (req?.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.log(error);
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Get all notifly
route.get('/get', async (req, res) => {

    try {
        const notifly = await Notifly.find().sort({ createdAt: -1 }).populate({
            path: 'product',
            select: 'Product_Name',
        })

        if (notifly.length > 0) {
            const notiflyData = notifly.map(notifly => ({
                _id: notifly._id,
                // notiflyTitle: notifly.notiflyTitle,
                fileType: notifly.fileType,
                desc: notifly.desc,
                fileUrl: notifly.fileType === "image"
                    ? `${process.env.IMAGE_URL}/${notifly.fileUrl.replace(/\\/g, '/')}`
                    : notifly.fileUrl,
                notiflyStatus: notifly.notiflyStatus,
                productName: notifly?.product?.Product_Name,
                createdAt: new Date(notifly?.createdAt)?.toLocaleDateString('en-IN'),
            }));


            return res.status(200).json({
                type: "success",
                message: "Nottifly found successfully!",
                notifly_data: notiflyData,
            });

        } else {
            return res.status(404).json({
                type: "warning",
                message: "No Nottifly found!",
                notifly_data: [],

            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});


// Find notifly by id
route.get('/get/:id', async (req, res) => {
    const notiflyId = req.params.id;
    try {
        const notifly = await Notifly.findOne({ _id: notiflyId, notiflyStatus: true });

        if (!notifly) {
            return res.status(404).json({
                type: "warning",
                message: "No nottifly found!",
                notifly: {},
            });
        } else {
            const notiflyData = {
                _id: notifly._id,
                fileType: notifly.fileType,
                desc: notifly.desc,
                fileUrl: notifly.fileType === "image"
                    ? `${process.env.IMAGE_URL}/${notifly.fileUrl.replace(/\\/g, '/')}`
                    : notifly.fileUrl,
                notiflyStatus: notifly.notiflyStatus,
                createdAt: new Date(notifly?.createdAt)?.toLocaleDateString('en-GB'),
            };

            return res.status(200).json({
                type: "success",
                message: "Nottifly found successfully!",
                notifly: notiflyData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Get all notifly on mobile
route.get('/mob/get/all', async (req, res) => {
    try {
        const notifly = await Notifly.find({ notiflyStatus: true }).sort({ updatedAt: -1 });

        if (notifly.length > 0) {
            const notiflyData = notifly.map(notifly => ({
                ...notifly.toObject(),
                notifly_id: notifly._id,
                fileType: notifly.fileType,
                desc: notifly.desc,
                fileUrl: notifly.fileType === "image"
                    ? `${process.env.IMAGE_URL}/${notifly.fileUrl.replace(/\\/g, '/')}`
                    : notifly.fileUrl,
                notiflyStatus: notifly.notiflyStatus,
                date: formatDistanceToNow(new Date(notifly.createdAt), { addSuffix: true })
            }));

            return res.status(200).json({
                type: "success",
                message: "Nottifly found successfully!",
                notifly_data: notiflyData || [],
            });
        } else {
            return res.status(404).json({
                type: "success",
                message: "No Nottifly found!",
                notifly_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Find notifly by id for mobile
// route.get('/mob/get/:id', async (req, res) => {
//     const notiflyId = req.params.id;
//     try {
//         const notifly = await Nottifly.findOne({ _id: notiflyId, notiflyStatus: true });

//         if (!notifly) {
//             return res.status(404).json({
//                 type: "warning",
//                 message: "No notifly found!",
//                 notifly: [],
//             });
//         } else {
//             const notiflyData = {
//                 ...notifly.toObject(),
//                 notifly_id: notifly._id,
//                 notiflyTitle: notifly.notiflyTitle,
//                 notiflyImage: `${process.env.IMAGE_URL}/${notifly.notiflyImage?.replace(/\\/g, '/')}` || "",
//                 date: formatDistanceToNow(new Date(notifly.createdAt), { addSuffix: true })
//             };

//             return res.status(200).json({
//                 type: "success",
//                 message: "Nottifly found successfully!",
//                 notifly: [notiflyData] || [],
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
//     }
// });

// Delete all notifly
route.delete('/delete/all', async (req, res) => {
    try {
        const notiflye = await Notifly.find();

        for (const notifly of notiflye) {
            try {
                if (notifly.fileUrl && fs.existsSync(notifly.fileUrl)) {
                    fs.unlinkSync(notifly.fileUrl);
                }
            } catch (error) {

            }
        }

        await Notifly.deleteMany();
        res.status(200).json({ type: "success", message: "All Nottifly deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many notifly
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const notiflye = await Notifly.find({ _id: { $in: ids } });

        for (const notifly of notiflye) {
            try {
                if (notifly.fileUrl && fs.existsSync(notifly.fileUrl)) {
                    fs.unlinkSync(notifly.fileUrl);
                }
            } catch (error) {

            }
        }

        await Notifly.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected Nottifly deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete notifly by ID
route.delete('/delete/:id', async (req, res) => {
    const notiflyId = req.params.id;
    try {
        const notifly = await Notifly.findById(notiflyId);
        if (!notifly) {
            return res.status(404).json({ type: "warning", message: "Nottifly not found!" });
        }

        try {
            if (notifly.fileUrl && fs.existsSync(notifly.fileUrl)) {
                fs.unlinkSync(notifly.fileUrl);
            }
        } catch (error) {

        }

        await Notifly.findByIdAndDelete(notiflyId);
        res.status(200).json({ type: "success", message: "Nottifly deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {
    const subNottiflyId = await req.params.id

    try {
        const { notiflyStatus } = req.body
        const newNottifly = await Notifly.findByIdAndUpdate(subNottiflyId)
        newNottifly.notiflyStatus = await notiflyStatus

        await newNottifly.save()
        res.status(200).json({ type: "success", message: "Nottifly Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update notifly
route.patch('/update/:id', upload.single('image'), async (req, res) => {

    try {
        const notiflyId = req.params.id;
        const { desc, product, fileType } = req.body;

        const notifly = await Notifly.findById(notiflyId);
        const random = Math.random() * 1000;
        const notiflyTitle = `nottifly${random}`
        if (!notifly) {
            try {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (error) {
                console.error(error);
            }
            return res.status(404).json({ type: "warning", message: "Nottifly does not exist!" });
        }

        // const existingNottifly = await Notifly.findOne({ _id: { $ne: notiflyId } });

        // if (existingNottifly) {
        //     try {
        //         if (req.file) {
        //             fs.unlinkSync(req.file.path);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        //     return res.status(200).json({ type: "warning", message: "Nottifly with the same product already exists!" });
        // }
        if (!product == undefined || product === "") {

        }
        else {

            notifly.product = await product
        }

        notifly.desc = desc;
        notifly.fileType = fileType;

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${notiflyTitle.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/nottifly/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            notifly.fileUrl = imagePath;

            if (fileType === 'image') {
                notifly.fileUrl = imagePath;
            }
        }

        if (fileType === 'video') {
            notifly.fileUrl = req.body.fileUrl;
        }

        await notifly.save();
        return res.status(200).json({ type: "success", message: "Nottifly updated successfully!" });
    } catch (error) {
        try {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
        } catch (error) {
        }

        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});







module.exports = route

