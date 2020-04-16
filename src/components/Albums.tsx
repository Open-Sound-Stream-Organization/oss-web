import React from 'react';
import { IAlbum } from '../api/Models';
import { ModelView, Cover } from './Shared';
import TrackList from './TrackList';

function Active({ name, id, tracks, cover_url }: IAlbum) {
    return (
        <>
            <Cover src={cover_url} alt={name} />
            <TrackList {...{ tracks }} />
        </>
    )
}

function Albums() {
    return <ModelView endpoint='album' render={(a: IAlbum) => <Active {...a} />} />
}

export default Albums;