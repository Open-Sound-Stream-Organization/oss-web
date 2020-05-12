import React, { memo } from 'react';
import { useLoadingList } from '../api/Hooks';
import { IList, ISong } from '../api/Models';
import SongList from './SongList';

/**
 * Displays all songs of the User
 */
const Songs = memo(() => {
    return useLoadingList<ISong>('song', songs =>
        <SongList {...{ songs }} />
    )
});

export default Songs;