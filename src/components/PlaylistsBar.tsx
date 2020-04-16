import classes from 'classnames';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading, useApi } from '../api/Hooks';
import { IList, IPlaylist } from '../api/Models';
import Cell from './Cell';

function Playlist() {
    const { id: active } = useParams();

    const [playlists] = useApi<IList<IPlaylist>>('playlist');
    if (!playlists) return <Loading />

    return (
        <Cell area='playlists'>
            <ul className='list'>
                {playlists.objects.map(({ id, name }) =>
                    <li key={id} className={classes({ active: id.toString() === active })}>
                        <Link to={`/playlists/${id}`}>{name}</Link>
                    </li>
                )}
            </ul>
        </Cell>
    );
}

export default Playlist;

