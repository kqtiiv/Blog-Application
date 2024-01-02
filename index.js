import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// render webpages

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/explore", (req, res) => {
    res.render("explore.ejs");
});

app.get("/write", (req, res) => {
    res.render("write.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.post("/write", (req, res) => {
    var title = $("srcTitle").value;
    var bodyText = $("srcText").value;

    // if (title.length > 0) AND (bodyText.length > 0) {

    // }
});

app.listen(port, (req, res) => {
    console.log("Listening on port " + port);
});

