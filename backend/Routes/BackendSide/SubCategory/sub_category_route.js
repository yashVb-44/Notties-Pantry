const express = require('express')
const route = express.Router()
const multer = require('multer')
const SubCategory = require('../../../Models/BackendSide/sub_category_model')
const fs = require('fs');


// Create SubCategory
route.post('/add', async (req, res) => {
    try {
        const { subCategoryName, category } = req.body;
        const existingSubCategory = await SubCategory.findOne({ subCategoryName: subCategoryName });

        if (existingSubCategory) {
            return res.status(202).json({ type: 'warning', message: 'Sub-Category already exists!' });
        } else {
            const subCategory = new SubCategory({
                subCategoryName,
                category
            });

            await subCategory.save();
            return res.status(200).json({ type: 'success', message: 'Sub-Category added successfully!' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Get all subCategories
route.get('/get/all', async (req, res) => {

    try {
        const subCategories = await SubCategory.find().sort({ createdAt: -1 }).populate({
            path: 'category',
            select: 'categoryName',
        })


        if (subCategories.length > 0) {
            const subCategoryData = subCategories.map(subCategory => ({
                _id: subCategory._id,
                subCategoryName: subCategory?.subCategoryName,
                categoryName: subCategory?.category?.categoryName,
                subCategoryStatus: subCategory?.subCategoryStatus,
            }));

            const activesubCategories = subCategories.filter(subCategory => subCategory.subCategoryStatus);

            const activesubCategoryData = activesubCategories.map(subCategory => ({
                _id: subCategory._id,
                subCategoryName: subCategory.subCategoryName,
                categoryName: subCategory?.category?.categoryName,
            }));

            return res.status(200).json({
                type: "success",
                message: "subCategories found successfully!",
                sub_category_data: subCategoryData,
                active_sub_category_data: activesubCategoryData,
            });
        } else {
            return res.status(200).json({
                type: "warning",
                message: "No subCategories found!",
                sub_category_data: [],
                active_sub_category_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});


// Find subCategory (category Wise)
route.get('/get/all/categoryWise/:id', async (req, res) => {

    const categoryId = req.params.id

    try {
        const subCategories = await SubCategory.find({ category: categoryId, subCategoryStatus: true }).sort({ createdAt: -1 }).populate({
            path: 'category',
            select: 'categoryName',
        })


        if (subCategories.length > 0) {
            const activesubCategoryData = subCategories.map(subCategory => ({
                _id: subCategory._id,
                subCategoryName: subCategory?.subCategoryName,
                categoryName: subCategory?.category?.categoryName,
                subCategoryStatus: subCategory?.subCategoryStatus,
            }));


            return res.status(200).json({
                type: "success",
                message: "subCategories found successfully!",
                active_sub_category_data: activesubCategoryData,
            });
        } else {
            return res.status(200).json({
                type: "warning",
                message: "No subCategories found!",
                active_sub_category_data: [],
            });
        }
    }
    catch (error) {
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
})

// Find subCategory by id
route.get('/get/:id', async (req, res) => {
    const subCategoryId = req.params.id;
    try {
        const subCategory = await SubCategory.findOne({ _id: subCategoryId, subCategoryStatus: true }).populate({
            path: 'category',
            select: 'categoryName',
        })

        if (!subCategory) {
            return res.status(404).json({
                type: "warning",
                message: "No Sub-Category found!",
                subCategory: [],
            });
        } else {
            const subCategoryData = {
                _id: subCategory._id,
                subCategoryName: subCategory.subCategoryName,
                categoryName: subCategory?.category?.categoryName,
                categoryId: subCategory?.category?._id,
            };

            return res.status(200).json({
                type: "success",
                message: "Sub-Category found successfully!",
                subCategory: subCategoryData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
})

// Get all subCategories on mobile
route.get('/mob/get', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ subCategoryStatus: true }).sort({ createdAt: -1 });

        if (subCategories.length > 0) {
            const subCategoryData = subCategories.map(subCategory => ({
                _id: subCategory._id,
                subCategoryName: subCategory.subCategoryName,
                subCategoryStatus: subCategory.subCategoryStatus,
            }));

            return res.status(200).json({
                type: "success",
                message: "Sub-Categories found successfully!",
                subCategory: subCategoryData || [],
            });
        } else {
            return res.status(404).json({
                type: "success",
                message: "No Sub-Categories found!",
                subCategory: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Find subCategory by id for mobile
route.get('/mob/get/:id', async (req, res) => {
    const subCategoryId = req.params.id;
    try {
        const subCategory = await SubCategory.findOne({ _id: subCategoryId, subCategoryStatus: true });

        if (!subCategory) {
            return res.status(404).json({
                type: "warning",
                message: "No Sub-Category found!",
                subCategory: [],
            });
        } else {
            const subCategoryData = {
                _id: subCategory._id,
                subCategoryName: subCategory.subCategoryName,
            };

            return res.status(200).json({
                type: "success",
                message: "Sub-Category found successfully!",
                subCategory: [subCategoryData],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete all subCategories
route.delete('/delete/all', async (req, res) => {
    try {
        const subCategories = await SubCategory.find();

        await SubCategory.deleteMany();
        res.status(200).json({ type: "success", message: "All Sub-Categories deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many subCategories
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const subCategories = await SubCategory.find({ _id: { $in: ids } });

        await SubCategory.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected Sub-Categories deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete subCategories by ID
route.delete('/delete/:id', async (req, res) => {
    const subCategoryId = req.params.id;
    try {
        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ type: "warning", message: "Sub-Category not found!" });
        }

        await SubCategory.findByIdAndDelete(subCategoryId);
        res.status(200).json({ type: "success", message: "sUB-Category deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const SubCategoryId = await req.params.id

    try {
        const { subCategoryStatus } = req.body
        const newSubCategory = await SubCategory.findByIdAndUpdate(SubCategoryId)
        newSubCategory.subCategoryStatus = await subCategoryStatus

        await newSubCategory.save()
        res.status(200).json({ type: "success", message: "Sub-Category Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update SubCategory
route.patch('/update/:id', async (req, res) => {
    try {
        const subCategoryId = req.params.id;
        const { subCategoryName, category } = req.body;


        const existingSubCategory = await SubCategory.findOne({ subCategoryName: subCategoryName, _id: { $ne: subCategoryId } });

        if (existingSubCategory) {
            return res.status(409).json({ type: "warning", message: "Sub-Category already exists!" });
        } else {
            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) {
                return res.status(404).json({ type: "warning", message: "Sub-Category does not exist!" });
            }

            subCategory.subCategoryName = subCategoryName;
            subCategory.category = category;


            await subCategory.save();
            // console.log(subCategory)
            res.status(200).json({ type: "success", message: "Sub-Category updated successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});




module.exports = route

