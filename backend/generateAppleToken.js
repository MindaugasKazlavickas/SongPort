const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Load private key
const privateKey = fs.readFileSync(path.join(__dirname, "AuthKey.p8"), "utf8");

// Apple Developer Credentials
const TEAM_ID = "YOUR_TEAM_ID"; // Found in Apple Developer Account
const KEY_ID = "YOUR_KEY_ID"; // Found in Apple Developer > Music Keys
const TOKEN_EXPIRATION = "180d"; // Valid for 180 days

function generateAppleMusicToken() {
    const jwtToken = jwt.sign({}, privateKey, {
        algorithm: "ES256",
        expiresIn: TOKEN_EXPIRATION,
        keyid: KEY_ID,
        issuer: TEAM_ID,
    });

    return jwtToken;
}

module.exports = generateAppleMusicToken;