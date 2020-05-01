import classes from 'classnames';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLoading } from '../api/Hooks';
import { IList, IPlaylist } from '../api/Models';
import Cell from './Cell';

const Playlist = () => {
    const { id: active } = useParams();

    return useLoading<IList<IPlaylist>>('playlist', ({ objects }) =>
        <Cell area='playlists'>
            {(objects.length > 0)
                ? <ul className='list'>
                    {objects.map(({ id, name }) =>
                        <li key={id} className={classes({ active: id.toString() === active })}>
                            <Link to={`/playlists/${id}`}>{name}</Link>
                        </li>
                    )}
                </ul>
                : <p className='empty-info'>No playlists yet</p>
            }
        </Cell>
    );
}

export default Playlist;

