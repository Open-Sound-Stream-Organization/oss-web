import React from 'react';
import { IPlaylist, ISong } from '../api/Models';
import { ModelView } from './Shared';
import SongList from './SongList';
import { useApiBunch } from '../api/Hooks';

function Active({ songs: songURLs, ...rest }: IPlaylist) {
    const [songs] = useApiBunch<ISong>(songURLs);
    return <SongList {...{ songs }} />
}

function Playlists() {
    return <ModelView endpoint='playlist' render={(p: IPlaylist) => <Active {...p} />} />
}

export default Playlists;