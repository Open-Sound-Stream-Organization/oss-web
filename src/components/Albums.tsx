import React from 'react';
import { IAlbum } from '../api/Models';
import { ModelView } from './Shared';
import TrackList from './TrackList';

function Active({ name, id, tracks }: IAlbum) {
    return <TrackList {...{ tracks }} />
}

function Albums() {
    return <ModelView endpoint='album' render={(a: IAlbum) => <Active {...a} />} />
}

export default Albums;