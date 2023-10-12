const express = require('express')
const route = express.Router()
const multer = require('multer')
const Category = require('../../../Models/BackendSide/category_model')
const fs = require('fs');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/category')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Category
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { categoryName } = req.body;
        const categoryNameLower = categoryName.toLowerCase();
        const existingCategory = await Category.findOne({ categoryName: { $regex: new RegExp(categoryNameLower, 'i') } });

        if (existingCategory) {
            return res.status(202).json({ type: 'warning', message: 'Category already exists!' });
        } else {
            const category = new Category({
                categoryName
            });

            await category.save();

            if (req.file) {
                const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
                const random = Math.random() * 100;
                const imageFilename = `${categoryName.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
                const imagePath = `imageUploads/backend/category/${imageFilename}`;

                fs.renameSync(req.file.path, imagePath);
                category.categoryImage = imagePath;
                await category.save();

                return res.status(200).json({ type: 'success', message: 'Category added successfully!' });
            } else {
                return res.status(200).json({ type: 'success', message: 'Category added successfully!' });
            }
        }
    } catch (error) {
        try {
            if (req?.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.error(error);
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Get all categories
route.get('/get', async (req, res) => {

    try {
        const categories = await Category.find().sort({ createdAt: -1 })

        if (categories.length > 0) {
            const categoryData = categories.map(category => ({
                _id: category._id,
                categoryName: category.categoryName,
                categoryImage: `${process.env.IMAGE_URL}/${category.categoryImage?.replace(/\\/g, '/')}`,
                categoryStatus: category.categoryStatus,
            }));

            const activeCategories = categories.filter(category => category.categoryStatus);

            const activeCategoryData = activeCategories.map(category => ({
                _id: category._id,
                categoryName: category.categoryName,
                categoryImage: `${process.env.IMAGE_URL}/${category.categoryImage?.replace(/\\/g, '/')}`,
            }));

            return res.status(200).json({
                type: "success",
                message: "Categories found successfully!",
                category_data: categoryData,
                active_category_data: activeCategoryData,
            });
        } else {
            return res.status(404).json({
                type: "warning",
                message: "No categories found!",
                category_data: [],
                active_category_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});


// Find category by id
route.get('/get/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findOne({ _id: categoryId, categoryStatus: true });

        if (!category) {
            return res.status(404).json({
                type: "warning",
                message: "No category found!",
                category: {},
            });
        } else {
            const categoryData = {
                _id: category._id,
                categoryName: category.categoryName || "",
                categoryImage: `${process.env.IMAGE_URL}/${category.categoryImage?.replace(/\\/g, '/')}` || "",
            };

            return res.status(200).json({
                type: "success",
                message: "Category found successfully!",
                category: categoryData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Get all categories on mobile
route.get('/mob/get', async (req, res) => {
    try {
        const categories = await Category.find({ categoryStatus: true }).sort({ createdAt: -1 });

        if (categories.length > 0) {
            const categoryData = categories.map(category => ({
                category_id: category._id,
                categoryName: category.categoryName,
                categoryImage: `${process.env.IMAGE_URL}/${category.categoryImage?.replace(/\\/g, '/')}` || "",
                categoryStatus: category.categoryStatus,
            }));

            return res.status(200).json({
                type: "success",
                message: "Categories found successfully!",
                category_data: categoryData || [],
            });
        } else {
            return res.status(404).json({
                type: "success",
                message: "No categories found!",
                category_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Find category by id for mobile
route.get('/mob/get/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findOne({ _id: categoryId, categoryStatus: true });

        if (!category) {
            return res.status(404).json({
                type: "warning",
                message: "No category found!",
                category: [],
            });
        } else {
            const categoryData = {
                category_id: category._id,
                categoryName: category.categoryName,
                categoryImage: `${process.env.IMAGE_URL}/${category.categoryImage?.replace(/\\/g, '/')}` || "",
                categoryStatus: category.categoryStatus,
            };

            return res.status(200).json({
                type: "success",
                message: "Category found successfully!",
                category: [categoryData] || [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete all categories
route.delete('/delete/all', async (req, res) => {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            try {
                if (category.categoryImage && fs.existsSync(category.categoryImage)) {
                    fs.unlinkSync(category.categoryImage);
                }
            } catch (error) {

            }
        }

        await Category.deleteMany();
        res.status(200).json({ type: "success", message: "All Categories deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many categories
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const categories = await Category.find({ _id: { $in: ids } });

        for (const category of categories) {
            try {
                if (category.categoryImage && fs.existsSync(category.categoryImage)) {
                    fs.unlinkSync(category.categoryImage);
                }
            } catch (error) {

            }
        }

        await Category.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected Categories deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete category by ID
route.delete('/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ type: "warning", message: "Category not found!" });
        }

        try {
            if (category.categoryImage && fs.existsSync(category.categoryImage)) {
                fs.unlinkSync(category.categoryImage);
            }
        } catch (error) {

        }

        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ type: "success", message: "Category deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const subCategoryId = await req.params.id

    try {
        const { categoryStatus } = req.body
        const newCategory = await Category.findByIdAndUpdate(subCategoryId)
        newCategory.categoryStatus = await categoryStatus

        await newCategory.save()
        res.status(200).json({ type: "success", message: "Category Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update category
route.patch('/update/:id', upload.single('image'), async (req, res) => {

    try {
        const categoryId = req.params.id;
        const { categoryName } = req.body;

        const existingCategory = await Category.findOne({ categoryName: categoryName, _id: { $ne: categoryId } });

        if (existingCategory) {
            try {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "Category already exists!" });
        } else {
            const category = await Category.findById(categoryId);
            if (!category) {
                try {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                } catch (error) {

                }
                return res.status(404).json({ type: "warning", message: "Category does not exist!" });
            }

            category.categoryName = categoryName;

            if (req.file) {
                const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
                const random = Math.random() * 100;
                const imageFilename = `${categoryName.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
                const imagePath = `imageUploads/backend/category/${imageFilename}`;

                fs.renameSync(req.file.path, imagePath);

                category.categoryImage = imagePath;
            }

            await category.save();
            return res.status(200).json({ type: "success", message: "Category updated successfully!" });
        }
    } catch (error) {
        try {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
        } catch (error) {


        }
        console.log(error, "erro")
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});






module.exports = route

