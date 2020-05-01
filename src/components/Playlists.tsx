import React, { useState } from 'react';
import { IPlaylist } from '../api/Models';
import { ModelView } from './Shared';
import SongList from './SongList';
import { useLoading, useApi } from '../api/Hooks';
import { IList, ISong } from '../api/Models';
import { AddBoxIcon, IconButton } from '@material-ui/icons';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';


import { ReactiveBase, MultiList, Grid, Typography, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
import API from '../api/Api';

function DeleteButton({ songs }: { song: ISong }) {
    const [songs] = useApi<IList<ISong>>('song');
    //const [song, setSong] = useState<ISong | undefined>(undefined);
    const playlist: IPlaylist;
    const selected = songs.id === s?.id;
    const [DeleteSong, SetDeleteSong] = useState('');
    const [newSongs, SetNewSongs] = useState('');

    const onClick = () => {
        if (selected) {
            SetDeleteSong(song);
            SetNewSongs(playlist.filter(songs => songs.id => DeleteSong));
}else (e.message);
    }
<IconButton className='delete-button' {...{ onClick }
}> <DeleteForeverRoundedIcon render={API.put(`playlist/${playlist.id}`, { songs: newSongs })} /></IconButton>

}

function Active({ songs, ...rest }: IPlaylist) {
    const playlist: IPlaylist;

    //TODO nach Song soll ein Delete Button kommen
    return (
        <>
            <SongList {...{ songs: songs }} />
            <p><DeleteButton> {...{ song }}</DeleteButton></p>
        </>
    );
}

function addPlaylist() {
    const [playlistname, setPlaylistname] = useState('');
    //const [availableSongs, setAvailableSongs] = useState<ISong[]>([]);
    const [songlist, setSonglist] = useState<ISong[]>([]);
    const [error, setError] = useState<string | null>(null);
    const songList = ['/api/v1/songs/1', ''];
    const [songs] = useApi<IList<ISong>>('song');

    <div className="NewPlaylist">
        <form onSubmit={e => {
            e.preventDefault()
            API.post('playlist', { songlist, playlistname })
                .catch(e => setError(e.message))

        }}>
            <label>
                <input
                    id='playlistname'
                    type='text'
                    placeholder='Name der Playlist'
                    onChange={e => setPlaylistname(e.target.value)}
                    value={playlistname}
                    required
                />
                <MultiList
                    componentId="Playlist_SelectSongs"
                    dataField= 'songs'
                    title="SelectedSongs"
                    sortBy="asc"
                    showCheckbox={true}
                    showSearch={true}
                    placeholder="Search Songs"
                    queryFormat="and"
                    react={{ and: ["Search Songs"] }}
                    renderItem={({
                        songlist,
                        isSelected
                    }) => {
                        return (
                            <>
                                <div>
                                    {songs}
                                    <span sytle={{ marginLeft: 5, color: isSelected ? '#0094FF': '#FFFFF' }}></span>
                                </div>
                            </>
                            <ul>
                                {
                                    <li>
                                        <input
                                            type="checkbox"
                                            value={songlist}
                                            onChange={e => setSonglist(...songList, e.target.value)}
                                        />
                                        {songs.name}
                                        </li>
                                }
                                
                            </ul>
                        )
                    }
                    renderNoResutls={() => <p>No Results Found!</p>} />
                <select multiple={true} value={}></select>
            </label>
            <button type='submit'>Erstellen</button>
        </form>
    </div>
}

function Playlists() {

    return (<>
        <div>
            <label htmlFor="icon-button-file">
                <IconButton aria-lable="add" onChange={() => addPlaylist()}><AddBoxIcon /></IconButton>
            </label>
        </div>

        <ModelView endpoint='playlist' render={(p: IPlaylist) => <Active {...p} />} />
    </>
    );
}

export default Playlists;