import React from 'react';
import Cell from './Cell';
import { IActiveTrack, IAlbum } from '../api/Models';
import { useApi } from '../api/Hooks';
import { NO_COVER } from './App'
import { Cover } from './Shared';

function ActiveSong({ track }: { track: IActiveTrack }) {
    const [album] = useApi<IAlbum>(track.album);

    return (
            <Cover
                src={album?.cover_url}
                alt='Active Song Cover'
            />
    )
}

export default ActiveSong;