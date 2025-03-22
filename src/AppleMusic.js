const APPLE_MUSIC_API = "https://api.music.apple.com/v1/catalog/us/search";

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            console.warn(`Retrying Apple API request (${i + 1}/${retries})`);
        } catch (error) {
            console.error(`Fetch error (attempt ${i + 1}):`, error);
        }
        await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
    throw new Error("Apple Music API request failed after retries");
}

export async function searchSongsOnAppleMusic(songs) {
    try {
        const developerToken = await getAppleMusicToken();
        const musicUserToken = localStorage.getItem("appleMusicToken");

        if (!developerToken || !musicUserToken) {
            console.error("Missing Apple Music tokens");
            return { foundSongs: [], notFoundSongs: [] };
        }

        let foundSongs = [];
        let notFoundSongs = [];

        for (const song of songs) {
            try {
                const searchUrl = `${APPLE_MUSIC_API}?term=${encodeURIComponent(song.title + " " + song.artist)}&types=songs&limit=1`;
                const response = await fetchWithRetry(searchUrl, {
                    headers: { Authorization: `Bearer ${developerToken}` }
                });

                const data = await response.json();
                if (data.results.songs?.data?.length > 0) {
                    foundSongs.push({ ...song, appleMusicId: data.results.songs.data[0].id });
                } else {
                    notFoundSongs.push(song);
                }
            } catch (error) {
                console.error("Error searching Apple Music:", error);
                notFoundSongs.push(song);
            }
        }

        return { foundSongs, notFoundSongs };
    } catch (error) {
        console.error("Failed to retrieve Apple Music token:", error);
        return { foundSongs: [], notFoundSongs: songs };
    }
}

async function getAppleMusicToken() {
    try {
        const response = await fetch("/api/apple-music-token");
        if (!response.ok) throw new Error("Failed to fetch Apple Music token");
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Error fetching Apple Music token:", error);
        return null;
    }
}

export async function addSongsToAppleMusic(songs) {
    try {
        const developerToken = await getAppleMusicToken();
        const musicUserToken = localStorage.getItem("appleMusicToken");

        if (!developerToken || !musicUserToken) {
            console.error("Missing Apple Music tokens");
            return;
        }

        const songIds = songs.slice(0, 5).map(song => song.appleMusicId); // Limit to 5

        const response = await fetch("https://api.music.apple.com/v1/me/library", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${developerToken}`,
                "Music-User-Token": musicUserToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: songIds.map(id => ({ id, type: "songs" }))
            })
        });

        if (!response.ok) {
            console.error("Failed to add songs", await response.json());
        } else {
            console.log("Songs added to Apple Music successfully");
        }
    } catch (error) {
        console.error("Error adding songs to Apple Music:", error);
    }
}