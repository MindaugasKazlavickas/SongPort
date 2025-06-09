import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APPLE_KEY_ID;
const TOKEN_EXPIRATION = "1d";

const privateKey = process.env.APPLE_AUTH_KEY?.replace(/\\n/g, "\n");

if (!privateKey) {
    throw new Error("Missing Apple Developer private key (APPLE_AUTH_KEY)");
}

export function generateAppleMusicToken() {
    console.log(privateKey);
    return jwt.sign({}, privateKey, {
        algorithm: "ES256",
        expiresIn: TOKEN_EXPIRATION,
        keyid: KEY_ID,
        issuer: TEAM_ID,
    });
}