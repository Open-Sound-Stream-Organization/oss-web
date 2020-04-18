import React from 'react';
import { IAlbum, IArtist } from '../api/Models';
import { ModelView, Cover } from './Shared';
import SongList from './SongList';
import Cell from './Cell';
import { useLoading } from '../api/Hooks';
import { Link } from 'react-router-dom';

function Active({ name, artists, songs, cover_url }: IAlbum) {
    return (
        <>
            <Cover src={cover_url} alt={name} />
            <Cell area='artists'>
                {artists.map(a => <Artist key={a} url={a} />)}
            </Cell>
            <SongList {...{ songs }} />
        </>
    )
}

function Artist({ url }: { url: string }) {
    return useLoading<IArtist>(url, ({ name, id }) =>
        <Link to={`/artists/${id}`}>{name}</Link>
    );
}

function Albums() {
    return <ModelView endpoint='album' render={(a: IAlbum) => <Active {...a} />} />
}

export default Albums;