import { useState } from "react";

const CLIENT_ID = "your_spotify_client_id";
const REDIRECT_URI = "https://song-port.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-library-read"; // Allows reading liked songs

export default function SpotifyAuth() {
    const [token, setToken] = useState(null);

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Spotify to Apple Music</h1>
            {!token ? (
                <button onClick={handleLogin} className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-400">
                    Log in with Spotify
                </button>
            ) : (
                <p className="text-lg">Logged in! Fetching data...</p>
            )}
        </div>
    );
}