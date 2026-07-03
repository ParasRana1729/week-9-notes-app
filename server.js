const express = require("express");

const app = express();

const notes = [];
const users = [];

app.use(express.json()); // parses req.body else it will be undefined

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find((user) => user.username === username);
    if (userExists) {
        return res.status(403).json({
            message: "This username has been taken",
        });
    }

    users.push({
        username,
        password,
    });

    res.json({
        message: "You have signed up",
    });
});

app.post("/notes", (req, res) => {
    const note = req.body.note;
    notes.push(note);

    res.json({
        message: "Note added",
    });
});

app.get("/notes", (req, res) => {
    res.json({
        notes,
    });
});

// frontend endpoint that server the html file

app.get("/", (req, res) => {
    res.sendFile(
        "/home/paras/projects/web/week-9-notes-app/frontend/index.html",
    );
});

app.listen(
    3000,
    console.log("App is running at 3000 port\nhttp://localhost:3000"),
);
