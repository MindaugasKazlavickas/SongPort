import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Apple Developer Credentials
const TEAM_ID = process.env.APPLE_TEAM_ID; // Found in Apple Developer Account
const KEY_ID = process.env.APPLE_KEY_ID; // Found in Apple Developer > Music Keys
const TOKEN_EXPIRATION = "180d"; // Valid for 180 days

// Load private key from an environment variable
const privateKey = process.env.APPLE_AUTH_KEY?.replace(/\\n/g, "\n");

if (!privateKey) {
    throw new Error("Missing Apple Developer private key (APPLE_AUTH_KEY)");
}

export function generateAppleMusicToken() {
    return jwt.sign({}, privateKey, {
        algorithm: "ES256",
        expiresIn: TOKEN_EXPIRATION,
        keyid: KEY_ID,
        issuer: TEAM_ID,
    });
}