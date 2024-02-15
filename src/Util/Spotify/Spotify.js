import { json } from "react-router-dom";

let accessToken;
const clientId = "bf698bc39d88481bac8c72b7313b8091";
const redirectUrl = "http://localhost:3000";

const Spotify = {
    getAccessToken() {
        if (accessToken) return accessToken;
        const tokenInUrl = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        if (tokenInUrl && expiryTime) {
            accessToken = tokenInUrl[1];
            const expiresIn = Number(expiryTime);

            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

            window.history.pushState("Access token", null, "/");
            return accessToken
        }

        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
        window.location = redirect;
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: {Authorization: `bearer ${accessToken}`},
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if(!jsonResponse) {
                console.error("Response error");
            }
            return jsonResponse.track.items.map(t => ({
                id: t.id,
                name: t.name,
                artist: t.artist[0].name,
                album: t.album,
                uri: t.uri,
            }))
        })
    },

    savePlaylist(name, trackUris) {
        if(!name || !trackUris) return;
        const aToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${aToken}` };
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {headers: header})
        .then((response )=> response.json())
        .then((jsonResponse) => {
            userId = jsonResponse.id;
            let playlistId;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: header,
                method: "post",
                body: JSON.stringify({name: name}),
            })
            .then((response) => response.json())
            .then((jsonResponse) => {
                playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: header,
                    method: "post",
                    body: JSON.stringify({uris: trackUris}),
                })
            })
        });
    },
};

export {Spotify};