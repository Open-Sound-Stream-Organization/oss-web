import React from 'react';
import Cell from './Cell';
import { IActiveTrack, IAlbum } from '../api/Models';
import { useApi } from '../api/Hooks';

function ActiveSong({ track }: { track: IActiveTrack }) {
    const [album] = useApi<IAlbum>(track.album);

    return (
        <Cell area='cover'>
            <img
                src={album?.cover_url ?? require('../img/example-cover.jpg')}
                alt='Active Song Cover'
            />
        </Cell>
    )
}

export default ActiveSong;