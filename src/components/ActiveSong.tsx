import React from 'react';
import Cell from './Cell';
import { IAlbum, ISong } from '../api/Models';
import { useApi } from '../api/Hooks';
import { NO_COVER } from './App'
import usePlayer from '../api/Audio';
import { Cover } from './Shared';

const ActiveSong = () => {
    const { song } = usePlayer();
    return song
        ? <ActiveCover {...song} />
        : <Cover alt='No song playing' />;
}

const ActiveCover = (song: ISong) => {
    const [album] = useApi<IAlbum>(song.album);

    return (
        <Cover
            src={album?.cover_url}
            alt='Active Song Cover'
        />
    )
}

export default ActiveSong;