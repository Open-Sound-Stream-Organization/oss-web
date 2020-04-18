import React from 'react';
import { useParams } from 'react-router-dom';
import { Loading, useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, IList, ISong } from '../api/Models';
import Cell from './Cell';
import { Cover, ModelView } from './Shared';

function Artists() {
    return <ModelView endpoint='artist' render={(a: IArtist) => <Artist {...a} />} />;
}

function Artist({ albums }: IArtist) {
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
}

function Album({ url }: { url: string }) {
    return useLoading<IAlbum>(url, ({ cover_url, name, release, songs }) => (
        <div>
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
        </div>
    ));
}

function SongRow({ url }: { url: string }) {
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