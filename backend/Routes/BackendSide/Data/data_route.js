const express = require('express')
const route = express.Router()
const Data = require('../../../Models/BackendSide/data_model')
const fs = require('fs');


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create Data
route.post('/add', async (req, res) => {
    try {
        const { Data_Name } = req.body;
        const lowerCaseName = Data_Name?.toLowerCase();
        const capitalizedDataName = capitalizeFirstLetter(lowerCaseName);
        const existingData = await Data.findOne({ Data_Name: capitalizedDataName });

        if (existingData) {
            res.status(202).json({ type: "warning", message: "Specification already exists!" });
        } else {
            const data = new Data({
                Data_Type: req.body.Data_Type,
                Data_Name: capitalizedDataName,
            });

            await data.save();
            res.status(200).json({ type: "success", message: "Specification added successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


// get all data 
route.get('/get', async (req, res) => {
    try {
        const data = await Data.find().sort({ createdAt: -1 });
        // for show frontend side 
        const datas = await Data.find({ Data_Status: true }).sort({ createdAt: -1 });
        res.status(201).json({ type: "success", message: " Specification found successfully!", data: data, dataType: datas })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// find data by id
route.get('/get/:id', async (req, res) => {
    const { dataId } = req.params
    try {
        const data = await Data.findOne({ _id: dataId, Data_Status: true });
        res.status(201).json({ type: "success", message: " Specification found successfully!", datas: data || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// // get all data on mobile
route.get('/mob/get', async (req, res) => {
    const type = req.query.specType
    try {
        const data = await Data.find({ Data_Status: true, Data_Type: type }).sort({ createdAt: -1 });
        if (!data) {
            res.status(404).json({ type: "success", message: " No Specification Found!", data: [] })
        }
        else {
            const result = data.map(data => ({
                _id: data._id,
                dataType: data?.Data_Type || "",
                dataName: data.Data_Name || ""
            }));
            res.status(201).json({ type: "success", message: " Data found successfully!", data: result })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// // find data by id for mob
// route.get('/mob/get/:id', async (req, res) => {
//     const dataId = req.params.id;
//     try {
//         const data = await Data.findOne({ _id: dataId, Data_Status: true });
//         if (!data) {
//             res.status(404).json({ type: "warning", message: "No Data found!", data: [] })
//         }
//         else {
//             const result = {
//                 data_id: data._id,
//                 data_Name: data.Data_Name,
//                 data_Image: `http://${process.env.IP_ADDRESS}:${process.env.PORT}/${data.Data_Image?.path?.replace(/\\/g, '/')}` || "",
//                 data_Status: data.Data_Status,
//             };
//             res.status(201).json({ type: "success", message: " Data found successfully!", data: result })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//         console.log(error)
//     }
// });


// Delete all datas
route.delete('/delete', async (req, res) => {
    try {
        await Data.deleteMany();
        res.status(200).json({ type: "success", message: "All Specification deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// Delete many datas
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const datas = await Data.find({ _id: { $in: ids } });
        await Data.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Specification deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// Delete data by ID
route.delete('/delete/:id', async (req, res) => {
    const dataId = req.params.id;
    try {
        await Data.findByIdAndDelete(dataId);
        res.status(200).json({ type: "success", message: "Specification deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const DataId = await req.params.id

    try {
        const { Data_Status } = req.body
        const newData = await Data.findByIdAndUpdate(DataId)
        newData.Data_Status = await Data_Status

        await newData.save()
        res.status(200).json({ type: "success", message: "Specification Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})


// Update data
route.patch('/update/:id', async (req, res) => {
    try {
        const dataId = req.params.id;
        const { Data_Name, Data_Type } = req.body;

        const existingData = await Data.findOne({ Data_Name: Data_Name, _id: { $ne: dataId } });

        if (existingData) {
            return res.status(409).json({ type: "warning", message: "Specification already exists!" });
        } else {
            const data = await Data.findById(dataId);
            if (!data) {
                return res.status(404).json({ type: "warning", message: "Specification does not exist!" });
            }

            data.Data_Type = Data_Type
            data.Data_Name = Data_Name;

            await data.save();
            res.status(200).json({ type: "success", message: "Specification updated successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});



module.exports = route

