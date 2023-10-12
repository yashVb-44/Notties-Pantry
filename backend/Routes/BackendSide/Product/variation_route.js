const express = require('express')
const route = express.Router()
const multer = require('multer')
const { Variation, Product } = require('../../../Models/BackendSide/product_model');
const fs = require('fs');
const path = require('path');


// Set up multer storage and limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imageUploads/backend/variation");
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split(".").pop();
        cb(null, `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`);
    },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Create variations
route.post("/add/:productId", upload.array("images", 10), async (req, res) => {
    try {
        const {
            Variation_Name,
            Size_Stock,
            Size_Name,
            R0_Price,
            R1_Price,
            R2_Price,
            R3_Price,
            R4_Price,
            Disc_Price,
            R1_Min_Quantity,
            R2_Min_Quantity,
            R3_Min_Quantity,
            R4_Min_Quantity,
        } = req.body;

        const productId = req.params.productId;

        const images = req.files.map((file) => file.path);

        const variationSizes = Array.isArray(Size_Name)
            ? Size_Name.map((size, index) => ({
                Size_Name: size,
                Size_Stock: Size_Stock[index],
                R0_Price: R0_Price[index],
                R1_Price: R1_Price[index],
                R2_Price: R2_Price[index],
                R3_Price: R3_Price[index],
                R4_Price: R4_Price[index],
                Disc_Price: Disc_Price[index],
                R1_Min_Quantity: R1_Min_Quantity[index],
                R2_Min_Quantity: R2_Min_Quantity[index],
                R3_Min_Quantity: R3_Min_Quantity[index],
                R4_Min_Quantity: R4_Min_Quantity[index],
            }))
            : [
                {
                    Size_Name: Size_Name,
                    Size_Stock: Size_Stock,
                    R0_Price: R0_Price,
                    R1_Price: R1_Price,
                    R2_Price: R2_Price,
                    R3_Price: R3_Price,
                    R4_Price: R4_Price,
                    Disc_Price: Disc_Price,
                    R1_Min_Quantity: R1_Min_Quantity,
                    R2_Min_Quantity: R2_Min_Quantity,
                    R3_Min_Quantity: R3_Min_Quantity,
                    R4_Min_Quantity: R4_Min_Quantity,
                },
            ];

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ type: "error", message: "Product not found!" });
        }

        const newVariation = new Variation({
            Variation_Name: Variation_Name,
            Variation_Images: images,
            Variation_Size: variationSizes,
        });

        await newVariation.save();

        product.Variation.push(newVariation._id);
        await product.save();

        res.status(200).json({ type: "success", message: "Variation added successfully!" });
    } catch (error) {

        console.log("Failed to add variation:", error);
        res.status(500).json({ type: "error", message: "Failed to add variation" });
    }
});

// get all variation
route.get('/get/all', async (req, res) => {
    try {
        const variation = await Variation.find().sort({ createdAt: -1 });
        if (variation) {
            const result = variation.map(variation => {
                return {
                    ...variation.toObject(),
                    Variation_Images: variation?.Variation_Images?.map(image => `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`),
                }
            })
            return res.status(201).json({ type: "success", message: " Variation found successfully!", variation: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// find variation by id
route.get('/get/:id', async (req, res) => {

    const variationId = req.params.id

    try {
        const variation = await Variation.findById(variationId)
        if (variation) {
            const result = {
                ...variation.toObject(),
                _id: variation._id,
                Variation_Images: variation?.Variation_Images?.map(image => `${process.env.IMAGE_URL}/${image?.replace(/\\/g, '/')}`),
            }
            return res.status(200).json({ type: "success", message: "Variation found successfully!", variation: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "Variation not found !" })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete all variations
route.delete('/delete/all', async (req, res) => {
    try {

        const variations = await Variation.find();

        for (const variation of variations) {
            for (const image of variation?.Variation_Images) {
                try {
                    if (fs.existsSync(image)) {
                        fs.unlinkSync(image);
                    }
                } catch (error) {

                }
            }

            // Remove the variation from associated products
            const products = await Product.find({ Variation: variation._id });
            for (const product of products) {
                const index = product.Variation.indexOf(variation._id);
                if (index !== -1) {
                    product.Variation.splice(index, 1);
                    await product.save();
                }
            }
        }

        await Variation.deleteMany();

        res.status(200).json({ type: "success", message: "All Variations deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete variation by ID
route.delete('/delete/:id', async (req, res) => {
    const variationId = req.params.id;
    try {
        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        // Delete the variation images from the folder
        for (const image of variation.Variation_Images) {
            try {
                if (fs.existsSync(image?.Variation_Image)) {
                    fs.unlinkSync(image?.Variation_Image);
                }
            } catch (error) {
                return res.status(500).json({ type: "error", message: "Error deleting image", errorMessage: error });
            }
        }

        // Remove the variation from associated products
        const products = await Product.find({ Variation: variationId });
        for (const product of products) {
            const index = product.Variation.indexOf(variationId);
            if (index !== -1) {
                product.Variation.splice(index, 1);
                await product.save();
            }
        }

        await Variation.findByIdAndDelete(variationId);
        res.status(200).json({ type: "success", message: "Variation deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple variations by IDs
route.delete('/deletes', async (req, res) => {
    const { ids } = req.body;
    try {
        const variations = await Variation.find({ _id: { $in: ids } });

        for (const variation of variations) {
            // Delete images from the folder for each variation
            for (const image of variation?.Variation_Images) {
                try {
                    if (fs.existsSync(image)) {
                        fs.unlinkSync(image);
                    }
                } catch (error) {
                    return res.status(500).json({ type: "error", message: "Error deleting image", errorMessage: error });
                }
            }

            // Remove the variation from associated products
            const products = await Product.find({ Variation: variation._id });
            for (const product of products) {
                const index = product.Variation.indexOf(variation._id);
                if (index !== -1) {
                    product.Variation.splice(index, 1);
                    await product.save();
                }
            }
        }

        await Variation.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ type: "success", message: "Variations deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const variationId = await req.params.id

    try {
        const { variation_Status } = req.body
        const newVariation = await Variation.findByIdAndUpdate(variationId)
        newVariation.Variation_Status = await variation_Status

        await newVariation.save()
        res.status(200).json({ type: "success", message: "Variation Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only size status
route.patch("/update/size/status/:variationId/:sizeId", async (req, res) => {
    const variationId = req.params.variationId;
    const sizeId = req.params.sizeId;

    try {
        const { Size_Status } = req.body;

        // Find the variation by ID
        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        // Find the size in the Variation_Size array with the given sizeId
        const sizeToUpdate = variation.Variation_Size.find((size) => size._id.toString() === sizeId);
        if (!sizeToUpdate) {
            return res.status(404).json({ type: "error", message: "Size not found in the variation!" });
        }

        // Update the Size_Status of the size
        sizeToUpdate.Size_Status = Size_Status;

        // Save the updated variation
        await variation.save();

        res.status(200).json({ type: "success", message: "Size Status update successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// delete a particular size
route.delete("/delete/size/:variationId/:sizeId", async (req, res) => {
    const variationId = req.params.variationId;
    const sizeId = req.params.sizeId;

    try {
        // Find the variation by ID
        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        // Filter out the size to delete from the Variation_Size array
        const updatedSizes = variation.Variation_Size.filter((size) => size._id.toString() !== sizeId);

        // Check if the size exists in the array
        if (variation.Variation_Size.length === updatedSizes.length) {
            return res.status(404).json({ type: "error", message: "Size not found in the variation!" });
        }

        // Update the Variation_Size array with the filtered sizes
        variation.Variation_Size = updatedSizes;

        // Save the updated variation
        await variation.save();

        res.status(200).json({ type: "success", message: "Size deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple sizes from a variation
route.delete("/deletes/sizes/:variationId", async (req, res) => {
    const variationId = req.params.variationId;
    const { sizeIds } = req.body;

    try {
        // Find the variation by ID
        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        // Filter out the sizes to delete from the Variation_Size array
        variation.Variation_Size = variation.Variation_Size.filter((size) => !sizeIds.includes(size._id.toString()));

        // Save the updated variation
        await variation.save();

        res.status(200).json({ type: "success", message: "Sizes deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Update variation by id
route.patch('/update/:variationId', upload.array('images', 10), async (req, res) => {
    try {
        const { Variation_Name } = req.body;
        const variationId = req.params.variationId;

        const images = req.files.map((file) => {
            const originalFilename = file.originalname;
            const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${Variation_Name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = 'imageUploads/backend/variation/' + imageFilename;

            fs.renameSync(file?.path, imagePath);

            return imagePath;
        });

        // Find the variation by ID
        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        variation.Variation_Name = Variation_Name;
        if (req.files.length <= 0) {
        }
        else {
            variation.Variation_Images = images;
        }

        // Save the updated variation to the database
        await variation.save();

        res.status(200).json({ type: "success", message: "Variation updated successfully!" });
    } catch (error) {
        console.error('Failed to update variation:', error);
        res.status(500).json({ error: 'Failed to update variation' });
    }
});

// Update all fields within a variation size by ID
route.patch("/update/size/:variationId/:sizeId", async (req, res) => {
    try {
        const variationId = req.params.variationId;
        const sizeId = req.params.sizeId;
        const { Size_Name, Size_Stock, R0_Price, R1_Price, R2_Price, R3_Price, R4_Price, Disc_Price, R1_Disc_Price, R2_Disc_Price, R3_Disc_Price, R4_Disc_Price, R1_Min_Quantity, R2_Min_Quantity, R3_Min_Quantity, R4_Min_Quantity } = req.body;

        const variation = await Variation.findById(variationId);
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        const sizeIndex = variation.Variation_Size.findIndex((size) => size._id.toString() === sizeId);
        if (sizeIndex === -1) {
            return res.status(404).json({ type: "error", message: "Variation size not found!" });
        }

        // Update all fields within the variation size data
        variation.Variation_Size[sizeIndex].Size_Name = Size_Name;
        variation.Variation_Size[sizeIndex].Size_Stock = Size_Stock;
        variation.Variation_Size[sizeIndex].R0_Price = R0_Price;
        variation.Variation_Size[sizeIndex].R1_Price = R1_Price;
        variation.Variation_Size[sizeIndex].R2_Price = R2_Price;
        variation.Variation_Size[sizeIndex].R3_Price = R3_Price;
        variation.Variation_Size[sizeIndex].R4_Price = R4_Price;
        variation.Variation_Size[sizeIndex].Disc_Price = Disc_Price;
        variation.Variation_Size[sizeIndex].R1_Min_Quantity = R1_Min_Quantity;
        variation.Variation_Size[sizeIndex].R2_Min_Quantity = R2_Min_Quantity;
        variation.Variation_Size[sizeIndex].R3_Min_Quantity = R3_Min_Quantity;
        variation.Variation_Size[sizeIndex].R4_Min_Quantity = R4_Min_Quantity;

        // Save the updated variation to the database
        await variation.save();

        res.status(200).json({ type: "success", message: "All fields updated successfully!" });
    } catch (error) {
        console.error("Failed to update variation size:", error);
        res.status(500).json({ type: "error", message: "Failed to update variation size", errorMessage: error.message });
    }
});

// Add a new size to a variation
route.post("/add/size/:variationId", async (req, res) => {

    try {
        const variationId = req.params.variationId;
        const { Size_Name, Size_Stock, R0_Price, R1_Price, R2_Price, R3_Price, R4_Price, Disc_Price, R1_Disc_Price, R2_Disc_Price, R3_Disc_Price, R4_Disc_Price, R1_Min_Quantity, R2_Min_Quantity, R3_Min_Quantity, R4_Min_Quantity } = req.body;

        const variation = await Variation.findById(variationId);
        console.log(variation)
        if (!variation) {
            return res.status(404).json({ type: "error", message: "Variation not found!" });
        }

        // Create a new size object
        const newSize = {
            Size_Name,
            Size_Stock,
            R0_Price,
            R1_Price,
            R2_Price,
            R3_Price,
            R4_Price,
            Disc_Price,
            R1_Min_Quantity,
            R2_Min_Quantity,
            R3_Min_Quantity,
            R4_Min_Quantity,
        };

        // Add the new size to the Variation_Size array
        variation.Variation_Size.unshift(newSize);

        // Save the updated variation to the database
        await variation.save();

        res.status(201).json({ type: "success", message: "Size added successfully!", size: newSize });
    } catch (error) {
        console.error("Failed to add size:", error);
        res.status(500).json({ type: "error", message: "Failed to add size" });
    }
});

// find all the variation for particular products
route.get('/get/byProductId/:productID', async (req, res) => {

    try {
        const productID = req.params.productID;
        // Find the product by its ID
        const product = await Product.findById(productID);

        if (!product) {
            return res.status(404).json({ type: "error", message: 'Product not found' });
        }

        // Find the associated variations
        const variations = await Variation.find({ _id: { $in: product.Variation } });

        res.status(200).json({ type: "success", message: "Variation get successfully!", variations: variations || [] });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server error" });
    }
});


// Route to get all Variation_Size for a particular variation
route.get('/get/sizes/byVariationId/:variationID', async (req, res) => {
    try {
        const variationID = req.params.variationID;

        // Find the variation by its ID
        const variation = await Variation.findById(variationID);

        if (!variation) {
            return res.status(404).json({ type: "error", message: 'Product Variation not found' });
        }

        // Get the Variation_Size from the found variation
        const sizes = variation.Variation_Size;

        res.status(200).json({ type: "success", message: "Variation Sizes get successfully!", variationSize: sizes || [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = route
