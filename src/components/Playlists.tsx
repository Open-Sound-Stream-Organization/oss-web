import React from 'react';
import { IPlaylist } from '../api/Models';
import { ModelView } from './Shared';
import TrackList from './TrackList';

function Active({ tracks , ...rest }: IPlaylist) {
    return <TrackList {...{ tracks }} />
}

function Playlists() {
    return <ModelView endpoint='playlist' render={(p: IPlaylist) => <Active {...p} />} />
}

export default Playlists;