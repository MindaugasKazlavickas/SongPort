import express from "express";
import cors from "cors";
import { generateAppleMusicToken } from "./generateAppleToken.js";

const app = express();

// Allow CORS for your frontend only (change the origin)
app.use(cors({ origin: "https://song-port.vercel.app/" }));

app.get("/get-token", (req, res) => {
    try {
        const token = generateAppleMusicToken();
        res.json({ token });
    } catch (error) {
        console.error("Failed to generate Apple Music token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});