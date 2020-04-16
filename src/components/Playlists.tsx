import React from 'react';
import { useLoading } from '../api/Hooks';
import { IPlaylist, IList } from '../api/Models';
import { useDialog } from './Dialog';
import { Link, useParams } from 'react-router-dom';
import TrackList from './TrackList';
import Cell from './Cell';

function List() {
    const { open } = useDialog();
    return useLoading<IList<IPlaylist>>('playlist', ({ objects }) =>
        <ul>
            {objects.map(({ name, id }) =>
                <li>
                    <Link to={`/playlists/${id}`}>
                        {name}
                    </Link>
                </li>
            )}
        </ul>
    );
}

function Tracks({ id }: { id: string }) {
    return useLoading<IPlaylist>(`playlist/${id}`, ({ name, tracks }) =>
        <div>
            <h1>{name}</h1>
            <TrackList {...{ tracks }} />
        </div>
    )
}

function Playlists() {
    const { id } = useParams();

    return (
        <>
            <Cell area='list'>
                <List />
            </Cell>
            <Cell area='songs'>
                {id
                    ? <Tracks {...{ id }} />
                    : <h1>Select a playlist</h1>

                }
            </Cell>
        </>
    )
}

export default Playlists;