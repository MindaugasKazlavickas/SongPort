const express = require("express");
const cors = require("cors");
const generateAppleMusicToken = require("./generateAppleMusicToken");

const app = express();
app.use(cors());

app.get("/get-token", (req, res) => {
    const token = generateAppleMusicToken();
    res.json(token);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});