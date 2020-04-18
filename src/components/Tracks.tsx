import React, { useState, useRef } from 'react';
import { ISong, IList } from '../api/Models';
import { Link } from 'react-router-dom';
import { useLoading } from '../api/Hooks';
import SongList from './SongList';
import API from '../api/FakeApi';

function Songs() {
    return useLoading<IList<ISong>>('song', ({ objects }) =>
        <SongList songs={objects} />
    )
}

export default Songs;