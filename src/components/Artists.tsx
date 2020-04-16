import React from 'react';
import { useParams } from 'react-router-dom';
import { Loading, useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, IList, ITrack } from '../api/Models';
import { NO_COVER } from './App';
import Cell from './Cell';
import { ModelSidebar, ModelView } from './Shared';

function Artists() {
    const { id } = useParams();
    const [artists] = useApi<IList<IArtist>>('artist');

    if (!artists) return <Loading />

    return <ModelView endpoint='artist' render={(a: IArtist) => <Artist {...a} />} />;
}

function Artist({ albums }: IArtist) {
    return (
        <>
            <Cell area='albums'>
                {albums.length > 0
                    ? albums.map(a => <Album key={a} url={a} />)
                    : <p className='center'>No albums yet</p>
                }
            </Cell>
        </>
    );
}

function Album({ url }: { url: string }) {
    return useLoading<IAlbum>(url, ({ cover_url, name, release, tracks }) => (
        <div>
            <h5>{name} - (Genre {release})</h5>
            <img
                className="mr-3"
                src={cover_url ?? NO_COVER}
                alt="Cover"
            />
            <table>
                <tbody>
                    {tracks.map(t => <TrackRow key={t} url={t} />)}
                </tbody>
            </table>
        </div>
    ));
}

function TrackRow({ url }: { url: string }) {
    const [track] = useApi<ITrack>(url);

    return (
        <tr>
            {track
                ? <>
                    <td>{track.name}</td>
                    <td>{track.length}</td>
                </>
                : <td rowSpan={2}><Loading /></td>
            }
        </tr>
    );
}

export default Artists;