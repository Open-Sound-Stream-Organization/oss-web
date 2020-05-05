import React from 'react';
import { useLoading } from '../api/Hooks';
import { IList, ISong } from '../api/Models';
import SongList from './SongList';

const Songs = () => {
    return useLoading<IList<ISong>>('song', ({ objects }) =>
        <SongList songs={objects} />
    )
}

export default Songs;