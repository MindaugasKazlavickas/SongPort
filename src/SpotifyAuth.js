import { useState, useEffect} from "react";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "https://song-port.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-library-read"; // Allows reading liked songs

export default function SpotifyAuth() {
    const [token, setToken] = useState(null);
    const [likedSongsCount, setLikedSongsCount] = useState(null);
    const [songs, setSongs] = useState([]);

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
            fetchLikedSongs();
        }
    }, [token]);


    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
    };

    const fetchLikedSongs = async () => {
        let fetchedSongs = [];
        let url = "https://api.spotify.com/v1/me/tracks";

        while(url){
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                // If you want to pass the song details to something else (like Apple Music search)
                fetchedSongs = fetchedSongs.concat(data.items.map(item => ({
                    title: item.track.name,
                    artist: item.track.artists[0].name,
                    album: item.track.album.name,
                    id: item.track.id
                })));

                url = data.next;
                // You can now pass this `songs` array to another function to search on Apple Music or for other use.
            } catch (error) {
                console.error("Error fetching liked songs:", error);
                break;
            }
        }
        setSongs(fetchedSongs);
        setLikedSongsCount(fetchedSongs.length);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Song Port</h1>
            <h3 className="text-2xl font-bold mb-6">Transfer your music from Spotify to Apple Music</h3>
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

            {/* Display the list of songs */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold">Liked Songs:</h2>
                <ul className="space-y-2">
                    {songs.map((song, index) => (
                        <li key={index} className="text-lg">
                            <strong>{song.title}</strong> by {song.artist} ({song.album})
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}