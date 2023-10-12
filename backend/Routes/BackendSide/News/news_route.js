const express = require('express')
const route = express.Router()
const multer = require('multer')
const News = require('../../../Models/BackendSide/news_model')
const fs = require('fs');
const { formatDistanceToNow } = require('date-fns');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/news')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create News
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { newsTitle, desc } = req.body;


        const news = new News({
            newsTitle,
            desc
        });

        await news.save();

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${newsTitle.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/news/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            news.newsImage = imagePath;
            await news.save();

            return res.status(200).json({ type: 'success', message: 'News added successfully!' });
        } else {
            return res.status(200).json({ type: 'success', message: 'News added successfully!' });
        }

    } catch (error) {
        try {
            if (req?.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Get all news
route.get('/get', async (req, res) => {

    try {
        const news = await News.find().sort({ createdAt: -1 })

        if (news.length > 0) {
            const newsData = news.map(news => ({
                _id: news._id,
                newsTitle: news.newsTitle,
                desc: news.desc,
                newsImage: `${process.env.IMAGE_URL}/${news.newsImage?.replace(/\\/g, '/')}`,
                newsStatus: news.newsStatus,
            }));


            return res.status(200).json({
                type: "success",
                message: "News found successfully!",
                news_data: newsData,

            });
        } else {
            return res.status(404).json({
                type: "warning",
                message: "No News found!",
                news_data: [],

            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});


// Find news by id
route.get('/get/:id', async (req, res) => {
    const newsId = req.params.id;
    try {
        const news = await News.findOne({ _id: newsId, newsStatus: true });

        if (!news) {
            return res.status(404).json({
                type: "warning",
                message: "No news found!",
                news: {},
            });
        } else {
            const newsData = {
                _id: news._id,
                newsTitle: news.newsTitle || "",
                newsImage: `${process.env.IMAGE_URL}/${news.newsImage?.replace(/\\/g, '/')}` || "",
            };

            return res.status(200).json({
                type: "success",
                message: "News found successfully!",
                news: newsData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Get all news on mobile
route.get('/mob/get/all', async (req, res) => {
    try {
        const news = await News.find({ newsStatus: true }).sort({ updatedAt: -1 });

        if (news.length > 0) {
            const newsData = news.map(news => ({
                ...news.toObject(),
                news_id: news._id,
                newsTitle: news.newsTitle,
                newsImage: `${process.env.IMAGE_URL}/${news.newsImage?.replace(/\\/g, '/')}` || "",
                date: formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })
            }));

            return res.status(200).json({
                type: "success",
                message: "News found successfully!",
                news_data: newsData || [],
            });
        } else {
            return res.status(404).json({
                type: "success",
                message: "No News found!",
                news_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Find news by id for mobile
route.get('/mob/get/:id', async (req, res) => {
    const newsId = req.params.id;
    try {
        const news = await News.findOne({ _id: newsId, newsStatus: true });

        if (!news) {
            return res.status(404).json({
                type: "warning",
                message: "No news found!",
                news_data: [],
            });
        } else {
            const newsData = {
                ...news.toObject(),
                news_id: news._id,
                newsTitle: news.newsTitle,
                newsImage: `${process.env.IMAGE_URL}/${news.newsImage?.replace(/\\/g, '/')}` || "",
                date: formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })
            };

            return res.status(200).json({
                type: "success",
                message: "News found successfully!",
                news_data: [newsData] || [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete all news
route.delete('/delete/all', async (req, res) => {
    try {
        const newse = await News.find();

        for (const news of newse) {
            try {
                if (news.newsImage && fs.existsSync(news.newsImage)) {
                    fs.unlinkSync(news.newsImage);
                }
            } catch (error) {

            }
        }

        await News.deleteMany();
        res.status(200).json({ type: "success", message: "All News deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many news
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const newse = await News.find({ _id: { $in: ids } });

        for (const news of newse) {
            try {
                if (news.newsImage && fs.existsSync(news.newsImage)) {
                    fs.unlinkSync(news.newsImage);
                }
            } catch (error) {

            }
        }

        await News.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected News deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete news by ID
route.delete('/delete/:id', async (req, res) => {
    const newsId = req.params.id;
    try {
        const news = await News.findById(newsId);
        if (!news) {
            return res.status(404).json({ type: "warning", message: "News not found!" });
        }

        try {
            if (news.newsImage && fs.existsSync(news.newsImage)) {
                fs.unlinkSync(news.newsImage);
            }
        } catch (error) {

        }

        await News.findByIdAndDelete(newsId);
        res.status(200).json({ type: "success", message: "News deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.patch("/update/status/:id", async (req, res) => {

    const subNewsId = await req.params.id

    try {
        const { newsStatus } = req.body
        const newNews = await News.findByIdAndUpdate(subNewsId)
        newNews.newsStatus = await newsStatus

        await newNews.save()
        res.status(200).json({ type: "success", message: "News Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update news
route.patch('/update/:id', upload.single('image'), async (req, res) => {

    try {
        const newsId = req.params.id;
        const { newsTitle, desc } = req.body;

        const existingNews = await News.findOne({ newsTitle: newsTitle, _id: { $ne: newsId } });

        if (existingNews) {
            try {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "News already exists!" });
        } else {
            const news = await News.findById(newsId);
            if (!news) {
                try {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                } catch (error) {

                }
                return res.status(404).json({ type: "warning", message: "News does not exist!" });
            }

            news.newsTitle = newsTitle;
            news.desc = desc;

            if (req.file) {
                const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
                const random = Math.random() * 100;
                const imageFilename = `${newsTitle.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
                const imagePath = `imageUploads/backend/news/${imageFilename}`;

                fs.renameSync(req.file.path, imagePath);

                news.newsImage = imagePath;
            }

            await news.save();
            return res.status(200).json({ type: "success", message: "News updated successfully!" });
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

