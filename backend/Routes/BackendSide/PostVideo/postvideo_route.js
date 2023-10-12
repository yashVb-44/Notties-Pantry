const express = require('express')
const route = express.Router()
const PostVideo = require('../../../Models/BackendSide/postvideo_model')
const fs = require('fs');


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create PostVideo
route.post('/add', async (req, res) => {
    try {
        const { name } = req.body;

        const video = new PostVideo({
            post_video_Name: name,
        });

        await video.save();
        res.status(200).json({ type: "success", message: "PostVideo added successfully!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all PostVideo 
route.get('/get', async (req, res) => {
    try {
        const postVideo = await PostVideo.find().sort({ createdAt: -1 });
        let result = []

        if (postVideo?.length > 0) {
            result = postVideo?.map(video => {
                return {
                    ...video.toObject(),
                    Date: new Date(video?.createdAt)?.toLocaleDateString('en-IN'),
                }
            })
        }

        res.status(200).json({ type: "success", message: " PostVideo found successfully!", PostVideo: result })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// find postVideo by id
route.get('/get/:id', async (req, res) => {
    const { videoId } = req.params
    try {
        const postVideo = await PostVideo.findOne({ _id: videoId });
        res.status(201).json({ type: "success", message: " PostVideo found successfully!", PostVideo: postVideo })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// find postVideo by id
route.get('/mob/get', async (req, res) => {
    try {
        const postVideo = await PostVideo.find({ post_video_Status: true });
        res.status(201).json({ type: "success", message: " PostVideo found successfully!", PostVideo: postVideo || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});


// Delete all postVideo
route.delete('/delete', async (req, res) => {
    try {
        await PostVideo.deleteMany();
        res.status(200).json({ type: "success", message: "All PostVideo deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// Delete many postVideo
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const postVideo = await PostVideo.find({ _id: { $in: ids } });
        await PostVideo.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All PostVideo deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// Delete data by ID
route.delete('/delete/:id', async (req, res) => {
    const videoId = req.params.id;
    try {
        await PostVideo.findByIdAndDelete(videoId);
        res.status(200).json({ type: "success", message: "PostVideo deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const videoId = await req.params.id

    try {
        const { post_video_Status } = req.body
        const newpost_video = await PostVideo.findByIdAndUpdate(videoId)
        newpost_video.post_video_Status = await post_video_Status

        await newpost_video.save()
        res.status(200).json({ type: "success", message: "PostVideo Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})


// Update data
route.patch('/update/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const { name } = req.body;

        const postVideo = await PostVideo.findById(videoId);
        if (!postVideo) {
            return res.status(404).json({ type: "warning", message: "PostVideo does not exist!" });
        }

        postVideo.post_video_Name = name

        await postVideo.save();
        res.status(200).json({ type: "success", message: "PostVideo updated successfully!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});



module.exports = route

