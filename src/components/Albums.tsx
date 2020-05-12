import React, { useMemo, useEffect } from 'react';
import { IAlbum, IArtist, ISong } from '../api/Models';
import { ModelView, Cover } from './Shared';
import SongList from './SongList';
import Cell from './Cell';
import { useLoading, useApiBunch } from '../api/Hooks';
import { Link } from 'react-router-dom';

const Active = ({ name, artists, songs: songURLs, cover_url }: IAlbum) => {
    const [songs] = useApiBunch<ISong>(songURLs);

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

const Artist = ({ url }: { url: string }) => {
    return useLoading<IArtist>(url, ({ name, id }) =>
        <Link to={`/artists/${id}`}>{name}</Link>
    );
}

const Albums = React.memo(() => {
    return <ModelView create endpoint='album' render={(a: IAlbum) => <Active {...a} />} />
});

export default Albums;