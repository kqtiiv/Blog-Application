require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

const connectDB = require("./server/config/db");

const app = express();
const port = 3000;

// parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(methodOverride("_method"));

// connect to database
connectDB();

// set static folder
app.use(express.static("public"));

// templating engine

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// render webpages

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));


app.listen(port, (req, res) => {
    console.log("Listening on port " + port);
});

