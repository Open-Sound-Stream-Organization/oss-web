import React, { memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loading, useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, IList, ISong } from '../api/Models';
import Cell from './Cell';
import { Cover, ModelView } from './Shared';

const Artists = React.memo(() => {
    return <ModelView create endpoint='artist' render={(a: IArtist) => <Artist {...a} />} />;
});

const Artist = ({ albums }: IArtist) => {
    return (
        <>
            <Cell area='albums'>
                {albums.length > 0
                    ? albums.map(a => <Album key={a} url={a} />)
                    : <p className='empty-info'>No albums yet</p>
                }
            </Cell>
        </>
    );
};

const Album = ({ url }: { url: string }) => {
    return useLoading<IAlbum>(url, ({ cover_url, name, release, songs, id }) => (
        <Link to={`/albums/${id}`}>
            <h5>{name} - (Genre {release})</h5>
            <Cover
                src={cover_url}
                alt='Cover'
            />
            <table>
                <tbody>
                    {(songs.length > 0)
                        ? songs.map(t => <SongRow key={t} url={t} />)
                        : <tr><td className='empty-info'>No songs yet</td></tr>
                    }
                </tbody>
            </table>
        </Link>
    ));
}

const SongRow = ({ url }: { url: string }) => {
    const [song] = useApi<ISong>(url);

    return (
        <tr>
            {song
                ? <>
                    <td>{song.name}</td>
                    <td>{song.length}</td>
                </>
                : <td rowSpan={2}><Loading /></td>
            }
        </tr>
    );
}

export default Artists;