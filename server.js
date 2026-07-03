const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const notes = []; // {username, note}
const users = []; // {username, password}

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

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find(
        (user) => user.username === username && user.password === password,
    );

    if (!userExists) {
        return res.status(403).json({
            message: "Invalid Credintials",
        });
    }

    const token = jwt.sign({ username }, "secret key");

    res.json({
        token,
    });
});

app.post("/notes", (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "you are not logged in",
        });
    }

    const decoded = jwt.verify(token, "secret key");
    const username = decoded.username;

    if (!username) {
        return res.status(403).json({
            message: "malformed jwt token",
        });
    }

    const note = req.body.note;
    notes.push({ note, username });

    res.json({
        message: "Note added",
    });
});

app.get("/notes", (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "you are not logged in",
        });
    }

    const decoded = jwt.verify(token, "secret key");
    const username = decoded.username;

    if (!username) {
        return res.status(403).json({
            message: "malformed jwt token",
        });
    }

    const userNote = notes.filter((note) => note.username === username);
    res.json({
        notes: userNote,
    });
});

// frontend endpoint that server the html file

app.get("/", (req, res) => {
    res.sendFile(
        "/home/paras/projects/web/week-9-notes-app/frontend/index.html",
    );
});

app.get("/signup", (req, res) => {
    res.sendFile(
        "/home/paras/projects/web/week-9-notes-app/frontend/signup.html",
    );
});

app.get("/signin", (req, res) => {
    res.sendFile(
        "/home/paras/projects/web/week-9-notes-app/frontend/signin.html",
    );
});

app.listen(
    3000,
    console.log("App is running at 3000 port\nhttp://localhost:3000"),
);
