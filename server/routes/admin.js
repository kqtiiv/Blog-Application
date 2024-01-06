const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json( { message: "Unauthorised" } );
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json( { message: "Unauthorised" } );
    }
}


router.get("/admin", async (req, res) => {
    try {
        const title = "Admin";
        
        res.render("../views/admin/index", { title: title });

    } catch (error) {
        console.log(error);
    }
});


// post check login

router.post("/admin", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json( {message: "Invalid credentials"} );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json( {message: "Invalid credentials"} );
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret );
        res.cookie("token", token), { httpOnly: true };

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
    }
});

// get dashbaord

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const title = "Dashboard";
        let numDisplayed = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: {createdAt: -1} } ])
        .skip(numDisplayed * page - numDisplayed)
        .limit(numDisplayed)
        .exec();

        const count = (await Post.find()).length;
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / numDisplayed);

        res.render("admin/dashboard", {
            title,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
    }
});

// get write

router.get("/write", authMiddleware, (req, res) => {
    let title = "Write";
    res.render("admin/write", {title: title});
});

// post blog

router.post("/write", authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

// get edit post page

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const title = "Edit Post";
        const data = await Post.findById(req.params.id);
        res.render("admin/edit-post", { data, title });
    } catch (error) {
        console.log(error);
    }
});

// put updated message

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect("../dashboard");
    } catch (error) {
        console.log(error);
    }
});

// delete post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id, {
            title: req.body.title,
            body: req.body.body
        });
        res.redirect("../dashboard");
    } catch (error) {
        console.log(error);
    }
});


// post register

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: "User Created", user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "User already in use!" });
            }
            res.status(500).json({ message: "Internal server error." })
        }

    } catch (error) {
        console.log(error);
    }
});

// get logout

router.get("/logout", authMiddleware, (req, res) => {
    try {
        res.clearCookie("token");
        // res.json( { message: "Logout successful" } );
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;