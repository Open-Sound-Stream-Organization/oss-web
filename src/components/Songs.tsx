import React, { memo } from 'react';
import { useLoadingList } from '../api/Hooks';
import { IList, ISong } from '../api/Models';
import SongList from './SongList';

//Songs des eingeloggten Users werden aufgelistet
const Songs = memo(() => {
    return useLoadingList<ISong>('song', songs =>
        <SongList {...{ songs }} />
    )
});

export default Songs;