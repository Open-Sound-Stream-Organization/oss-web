import React from 'react';
import Cell from './Cell';
import { IAlbum, ITrack } from '../api/Models';
import { useApi } from '../api/Hooks';
import { NO_COVER } from './App'
import usePlayer from '../api/Audio';

function ActiveSong() {
    const { track } = usePlayer();
    return track ? <ActiveCover {...track} /> : null;
}

function ActiveCover(track: ITrack) {
    const [album] = useApi<IAlbum>(track.album);

    return (
        <Cell area='cover'>
            <img
                src={album?.cover_url ?? NO_COVER}
                alt='Active Song Cover'
            />
        </Cell>
    )
}

export default ActiveSong;