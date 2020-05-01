import React, { useState } from 'react';
import { useLoading } from '../api/Hooks';
import { IList, ISong, IPlaylist } from '../api/Models';
import SongList from './SongList';
import { AddBoxIcon, IconButton } from '@material-ui/icons';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import Playlist from './PlaylistsBar';
import API from '../api/Api';

function Songs() {
    return (

        useLoading<IList<ISong>>('song', ({ objects }) => {
            <>
                <SongList songs={objects} />
                </>
                //song zu einer Playlist hinzufügen
                <>
                <IconButton onClick={e => addSongToPlaylist(e.target.id)}><AddBoxIcon /></IconButton>
           </>
        }
        )
    );
}
function addSongToPlaylist(song: ISong) {
    const [songs, setSongs] = useState<ISong[]>([]);
    const playlist: IPlaylist;
    const [playlistId, setPlaylistID] = useState<IPlaylist>('');
    setSongs([...songs, song]);
    // const newSongs={...playlist.songs, '/api/v1/'};
    // const newSongs=[...newSongs, song];

    <form onSubmit={
        e => {
            e.preventDefault();
            API.put(`playlist/${playlist.id}`, songs)
        }}
    >
        <select id='playlistid' onChange={e => setPlaylistID(e.target.value)} render ={(p:IPlaylist)=> p.name} >

            <option value={p.id} >{p.name}</option>
        </select>
    </form>
}

export default Songs;