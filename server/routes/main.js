const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// get home page

router.get("/", async (req, res) => {
    try {
        let title = "Home";
        let numDisplayed = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: {createdAt: -1} } ])
        .skip(numDisplayed * page - numDisplayed)
        .limit(numDisplayed)
        .exec();

        const count = (await Post.find()).length;
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / numDisplayed);

        res.render("home", {
            title,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
    }
});

function insertPostData() {
    Post.insertMany([
        {
            title: "Buidling a blog",
            body: "I made a blog using javascript today!"
        },
    ])
}

// insertPostData()

// View all posts

router.get("/explore", async (req, res) => {
    let title = "Explore";
    try {
        const data = await Post.find();
        res.render("explore", {title: title, data});
    } catch (err) {
        console.log(err);
    }
});

// get post: id

router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id; // grab the id
        const data = await Post.findById( { _id: slug } );
        const title = data.title;
        res.render("post", {title: title, data: data})
    } catch (error) {
        console.log(error);
    }
});

// post search term

router.post("/search", async (req, res) => {
    try {
        const title = "Search";

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChar, "i") } }
            ]
        });

        res.render("search", {
            data,
            title
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/about", (req, res) => {
    let title = "About";
    res.render("about", {title: title});
});

module.exports = router;