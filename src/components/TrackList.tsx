import React from 'react';
import { ITrack, IAlbum, IArtist } from '../api/Models';
import { Link } from 'react-router-dom';
import { useApi } from '../api/Hooks';

function TrackList({ tracks }: { tracks: ITrack[] }) {
    return (
        <table className='tracklist'>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Artists</th>
                    <th>Album</th>
                    <th>Length</th>
                </tr>
            </thead>
            <tbody>
                {tracks.map(({ album, artists, title, length }) =>
                    <tr>
                        <td>{title}</td>
                        <td>{artists.map(a =>
                            <Artist url={a} />
                        )}</td>
                        <td><Album url={album} /></td>
                        <td>{length}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

function Artist({ url }: { url: string }) {
    const [a] = useApi<IArtist>(url);
    return a ? <Link className='seperate-comma' to={`artist/${a.id}`}>{a.name}</Link> : null;
}

function Album({ url }: { url: string }) {
    const [a] = useApi<IAlbum>(url);
    return a ? <Link className='seperate-comma' to={`album/${a.id}`}>{a.name}</Link> : null;
}

export default TrackList;