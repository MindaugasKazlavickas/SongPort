import { useState, useEffect} from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "https://song-port.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-library-read"; // Allows reading liked songs

export default function SpotifyAuth() {
    const [token, setToken] = useState(null);
    const [likedSongsCount, setLikedSongsCount] = useState(null);

    useEffect(() => {
        // Get token from URL hash if available
        const hash = window.location.hash;
        let storedToken = window.localStorage.getItem("spotifyToken");

        if (!storedToken && hash) {
            const newToken = new URLSearchParams(hash.substring(1)).get("access_token");
            window.location.hash = "";
            window.localStorage.setItem("spotifyToken", newToken);
            setToken(newToken);
        } else {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchLikedSongsCount();
        }
    }, [token]);


    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
    };

    const fetchLikedSongsCount = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/tracks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setLikedSongsCount(data.total);
        } catch (error) {
            console.error("Error fetching liked songs count:", error);
        }
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

            {likedSongsCount !== null && (
                <p className="text-xl mt-4">Total Liked Songs: {likedSongsCount}</p>
            )}
        </div>
    );
}