//import logo from './logo.svg';
import React, {useState} from "react";
import styles from "./App.module.css";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { Spotify } from "../../Util/Spotify/Spotify";

function App () {
  const [searchResults, setSearchResults] = useState([
    {
      name: "example track Name 1",
      artist: "example track Artist 1",
      album: "example track Album 1",
      id: 1,
    },
    {
      name: "example track Name 2",
      artist: "example track Artist 2",
      album: "example track Album 2",
      id: 2,
    }]
  );
  
  const [playlistName, setPlaylistName] = useState("Example Playlist Name");
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      name: "example Playlsit Name 1",
      artist: "example Playlist Artist 1",
      album: "example Playlist Album 1",
      id: 1,
    },
    {
      name: "example Playlist Name 1",
      artist: "example Playlist Artist 1",
      album: "example Playlist Album 1",
      id: 2,
    },
    {
      name: "example Playlist Name 1",
      artist: "example Playlist Artist 1",
      album: "example Playlist Album 1",
      id: 3,
    },
  ]);

  function addTrack(track) {
    const existingTrack = playlistTracks.find(t => t.id === track.id);
    const newTrack = playlistTracks.concat(track);
    if (existingTrack) {
      console.log("Track already exists");
    } else {
      setPlaylistTracks(newTrack);
    }
  };

  function removeTrack(track) {
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  };

  function updatePlaylistName(name) {
    setPlaylistName(name);
  };

  function savePlaylist() {
    const trackURIs = playlistTracks.map((t) => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist")
      setPlaylistTracks([])
    })
  };

  function search(term) {
    Spotify.search(term).then(result => setSearchResults(result));
    console.log(term);
  };

  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>
      <div className={styles.App}>
        {/* <!-- Add a SearchBar component --> */}
        <SearchBar onSearch={search} />
        
        <div className={styles["App-playlist"]}>
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults usersearchResults={searchResults} onAdd={addTrack} />
          {/* <!-- Add a Playlist component --> */}
          <Playlist 
            playlistName={playlistName} 
            playlistTracks={playlistTracks} 
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
      );
}

export default App;