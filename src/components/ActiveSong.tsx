import React from 'react';
import Cell from './Cell';
import { IActiveTrack } from '../Models';

function ActiveSong(track: IActiveTrack) {
    return (
        <Cell area='cover'>
            <Cover />
        </Cell>
    )
}

function Cover() {
    return (
        <img alt='Active Song Cover' src={require('../img/example-cover.jpg')} />
    )
}

export default ActiveSong;