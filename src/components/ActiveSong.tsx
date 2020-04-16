import React from 'react';
import Cell from './Cell';
import { IAlbum, ITrack } from '../api/Models';
import { useApi } from '../api/Hooks';
import { NO_COVER } from './App'
import usePlayer from '../api/Audio';
import { Cover } from './Shared';

function ActiveSong() {
    const { track } = usePlayer();
    return track ? <ActiveCover {...track} /> : null;
}

function ActiveCover(track: ITrack) {
    const [album] = useApi<IAlbum>(track.album);

    return (
            <Cover
                src={album?.cover_url}
                alt='Active Song Cover'
            />
    )
}

export default ActiveSong;