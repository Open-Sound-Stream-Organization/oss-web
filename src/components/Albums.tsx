import React from 'react';
import { IAlbum, IArtist } from '../api/Models';
import { ModelView, Cover } from './Shared';
import TrackList from './TrackList';
import Cell from './Cell';
import { useLoading } from '../api/Hooks';

function Active({ name, artists, tracks, cover_url }: IAlbum) {
    return (
        <>
            <Cover src={cover_url} alt={name} />
            <Cell area='artists'>
                {artists.map(a => <Artist key={a} url={a} />)}
            </Cell>
            <TrackList {...{ tracks }} />
        </>
    )
}

function Artist({ url }: { url: string }) {
    return useLoading<IArtist>(url, ({ name }) =>
        <span>{name}</span>
    );
}

function Albums() {
    return <ModelView endpoint='album' render={(a: IAlbum) => <Active {...a} />} />
}

export default Albums;