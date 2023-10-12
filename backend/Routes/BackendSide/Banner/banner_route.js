const express = require('express')
const route = express.Router()
const multer = require('multer')
const Banner = require('../../../Models/BackendSide/banner_model')
const fs = require('fs');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/banner')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Banner
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { Banner_Sequence, Banner_Name, CategoryId } = req.body;

        console.log(CategoryId, "id")

        const existingBanner = await Banner.findOne(req.body);
        const existingSequence = await Banner.findOne({ Banner_Sequence });
        const existingBannerName = await Banner.findOne({ Banner_Name });

        if (existingBanner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            res.status(202).json({ type: "warning", message: "Banner already exists!" });
        } else if (existingBannerName) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            res.status(202).json({ type: "warning", message: "Banner with the same name already exists!" });
        } else if (existingSequence) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            res.status(202).json({ type: "warning", message: "Sequence already exists! Please add a different sequence." });
        } else {
            const banner = new Banner({
                Banner_Name: req.body.Banner_Name,
                Banner_Sequence: req.body.Banner_Sequence,
                CategoryId: req.body.CategoryId,
            });

            if (req?.file) {
                const originalFilename = req.file.originalname;
                const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                const imageFilename = `${req.body.Banner_Name.replace(/[#$%]/g, '').replace(/\s/g, '_')}${extension}`;
                const imagePath = 'imageUploads/backend/banner/' + imageFilename;

                fs.renameSync(req?.file?.path, imagePath);

                const image = imagePath
                banner.Banner_Image = image;
            }

            await banner.save();
            res.status(200).json({ type: "success", message: "Banner added successfully!" });
        }
    } catch (error) {
        if (req?.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        // console.log(error)
    }
});

// get all banner
route.get('/get', async (req, res) => {
    try {
        const banner = await Banner.find().populate('CategoryId', 'categoryName').sort({ createdAt: -1 });

        if (banner) {

            const result = banner.map(banner => ({
                _id: banner._id,
                Banner_Name: banner.Banner_Name,
                Banner_Image: `${process.env.IMAGE_URL}/${banner.Banner_Image?.replace(/\\/g, '/')}`,
                Banner_Sequence: banner.Banner_Sequence,
                Banner_Status: banner.Banner_Status,
                CategoryId: banner.CategoryId?._id,
                Category_Name: banner.CategoryId?.categoryName
            }));

            res.status(201).json({ type: "success", message: " Banner found successfully!", banner: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Banner Found!", banner: [], banners: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get banner by id
route.get('/get/:id', async (req, res) => {
    const bannerId = req.params.id
    try {
        const banner = await Banner.findById(bannerId).populate({
            path: 'CategoryId',
            select: 'categoryName',
        })
        if (!banner) {
            res.status(404).json({ type: "warning", message: "No Banner found!", banner: [] })
        }
        else {
            const result = {
                _id: banner._id,
                Banner_Name: banner.Banner_Name,
                Banner_Image: `${process.env.IMAGE_URL}/${banner.Banner_Image?.replace(/\\/g, '/')}`,
                Banner_Sequence: banner.Banner_Sequence,
                Category: {
                    _id: banner.CategoryId?._id,
                    categoryName: banner.CategoryId?.categoryName,
                },
            }
            res.status(201).json({ type: "success", message: " Banner found successfully!", banner: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all banner for mobile
route.get('/mob/get', async (req, res) => {
    try {
        const banner = await Banner.find({ Banner_Status: true }).sort({ createdAt: -1 });
        if (!banner) {
            res.status(200).json({ type: "warning", message: "No Banner found!", banner: [] })
        }
        else {
            const result = banner.map(banner => ({
                banner_id: banner._id,
                banner_Image: `${process.env.IMAGE_URL}/${banner.Banner_Image?.replace(/\\/g, '/')}` || "",
                banner_sequence: banner.Banner_Sequence,
                categoryId: banner.CategoryId
            }));
            res.status(201).json({ type: "success", message: " Banner found successfully!", banner: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all banners
route.delete('/delete', async (req, res) => {
    try {
        const banners = await Banner.find();

        if (banners.length > 0) {
            for (const banner of banners) {
                if (banner.Banner_Image && fs.existsSync(banner.Banner_Image)) {
                    try {
                        fs.unlinkSync(banner.Banner_Image);
                    } catch (error) {

                    }
                }
            }
        }

        await Banner.deleteMany();
        res.status(200).json({ type: "success", message: "All Banners deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific banner by ID
route.delete('/delete/:id', async (req, res) => {
    const bannerId = req.params.id;
    try {
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            res.status(404).json({ type: "error", message: "Banner not found!" });
        } else {
            try {
                if (banner.Banner_Image && fs.existsSync(banner.Banner_Image)) {
                    fs.unlinkSync(banner.Banner_Image);
                }
            } catch (error) {

            }

            // await Banner.findByIdAndDelete(bannerId);
            res.status(200).json({ type: "success", message: "Banner deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple banners by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const banners = await Banner.find({ _id: { $in: ids } });

        for (const banner of banners) {
            if (banner.Banner_Image && fs.existsSync(banner.Banner_Image)) {
                try {
                    fs.unlinkSync(banner.Banner_Image);
                } catch (error) {

                }
            }
        }

        await Banner.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Banners deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Bannerstatus 
route.patch("/update/status/:id", async (req, res) => {

    const BannerId = await req.params.id

    try {
        const { Banner_Status } = req.body
        const newBanner = await Banner.findByIdAndUpdate(BannerId)
        newBanner.Banner_Status = await Banner_Status

        await newBanner.save()
        res.status(200).json({ type: "success", message: "Banner Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific banner by ID
route.patch('/update/:id', upload.single('image'), async (req, res) => {
    const bannerId = req.params.id;
    const { Banner_Name, Banner_Sequence, CategoryId } = req.body;

    try {
        const existingBanner = await Banner.findOne({ Banner_Name, _id: { $ne: bannerId } });
        const existingBannerSequence = await Banner.findOne({ Banner_Sequence, _id: { $ne: bannerId } });

        if (existingBanner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(409).json({ type: "warning", message: "Banner already exists!" });
        }

        if (existingBannerSequence) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(202).json({ type: "warning", message: "Sequence already exists! Please add a different sequence." });
        }

        const banner = await Banner.findById(bannerId);

        if (!banner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Banner does not exist!" });
        }


        if (CategoryId === undefined || CategoryId === "") {
        }
        else {
            banner.CategoryId = await CategoryId
        }

        banner.Banner_Name = Banner_Name;
        banner.Banner_Sequence = Banner_Sequence;


        if (req.file) {

            if (banner.Banner_Image && fs.existsSync(banner.Banner_Image.path)) {
                try {
                    fs.unlinkSync(banner.Banner_Image.path);
                } catch (error) {

                }
            }

            // Update the image details
            const originalFilename = req.file.originalname;
            const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            const imageFilename = `${Banner_Name.replace(/[#$%]/g, '').replace(/\s/g, '_')}${extension}`;
            const imagePath = 'imageUploads/backend/banner/' + imageFilename;

            fs.renameSync(req?.file?.path, imagePath);

            banner.Banner_Image = imagePath;
        }

        await banner.save();
        res.status(200).json({ type: "success", message: "Banner updated successfully!" });
    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});




module.exports = route