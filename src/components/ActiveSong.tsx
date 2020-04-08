import React from 'react';
import Cell from './Cell';
import { IActiveTrack } from '../api/Models';

function ActiveSong({ track }: { track: IActiveTrack }) {
    return (
        <Cell area='cover'>
            <img
                src={track.album.cover_url}
                alt='Active Song Cover'
            />
        </Cell>
    )
}

export default ActiveSong;