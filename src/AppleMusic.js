import axios from "axios";

const APPLE_MUSIC_API = "https://api.music.apple.com/v1/catalog/us/search";



export async function searchSongsOnAppleMusic(songs) {
    const developerToken = process.env.REACT_APP_APPLE_MUSIC_TOKEN;
    const musicUserToken = localStorage.getItem("appleMusicToken");

    if (!developerToken || !musicUserToken) {
        console.error("Missing Apple Music tokens");
        return { foundSongs: [], notFoundSongs: [] };
    }

    let foundSongs = [];
    let notFoundSongs = [];

    for (const song of songs) {
        try {
            // Search for the artist first
            const artistSearchUrl = `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(song.artist)}&types=artists`;
            let response = await fetch(artistSearchUrl, {
                headers: { Authorization: `Bearer ${developerToken}` }
            });
            let data = await response.json();

            if (!data.results.artists || data.results.artists.data.length === 0) {
                notFoundSongs.push(song);
                continue;
            }

            // Search for the song by artist
            const songSearchUrl = `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist)}&types=songs`;
            response = await fetch(songSearchUrl, {
                headers: { Authorization: `Bearer ${developerToken}` }
            });
            data = await response.json();

            if (data.results.songs && data.results.songs.data.length > 0) {
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
}

export async function addSongsToAppleMusic(songs) {
    const developerToken = process.env.REACT_APP_APPLE_MUSIC_TOKEN;
    const musicUserToken = localStorage.getItem("appleMusicToken");

    if (!developerToken || !musicUserToken) {
        console.error("Missing Apple Music tokens");
        return;
    }

    const songIds = songs.slice(0, 5).map(song => song.appleMusicId); // Only add first 5 for now
    const addUrl = "https://api.music.apple.com/v1/me/library";

    try {
        const response = await fetch(addUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${developerToken}`,
                "Music-User-Token": musicUserToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: songIds.map(id => ({ id, type: "songs" })) })
        });

        if (response.ok) {
            console.log("Songs added to Apple Music successfully");
        } else {
            console.error("Failed to add songs", await response.json());
        }
    } catch (error) {
        console.error("Error adding songs to Apple Music:", error);
    }
}
