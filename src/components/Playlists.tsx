import React from 'react';
import { IPlaylist } from '../api/Models';
import { ModelView } from './Shared';
import SongList from './SongList';

function Active({ songs , ...rest }: IPlaylist) {
    return <SongList {...{ songs: songs }} />
}

function Playlists() {
    return <ModelView endpoint='playlist' render={(p: IPlaylist) => <Active {...p} />} />
}

export default Playlists;