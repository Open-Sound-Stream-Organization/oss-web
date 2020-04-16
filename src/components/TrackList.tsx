import React from 'react';
import { Link } from 'react-router-dom';
import { useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, ITrack } from '../api/Models';
import { TrackButton } from '../api/Audio';

function TrackList({ tracks }: { tracks: (ITrack | string)[] }) {
    if ((tracks?.length ?? 0) === 0) return <p className='center'>No tracks yet</p>
    return (
        <table className='tracklist'>
            <thead>
                <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Artists</th>
                    <th>Album</th>
                    <th>Length</th>
                </tr>
            </thead>
            <tbody>
                {tracks.map(track =>
                    <TrackRow key={typeof track === 'string' ? track : track.id} {...{ track }} />
                )}
            </tbody>
        </table>
    )
}

function TrackRow({ track }: { track: ITrack | string }) {
    if (typeof track === 'string') return <LoadingTrackRow url={track} />

    const { album, artists, title, length } = track;
    return (
        <tr>
            <td><TrackButton {...{ track }} /></td>
            <td>{title}</td>
            <td>{artists.map(a =>
                <Artist key={a} url={a} />
            )}</td>
            <td><Album url={album} /></td>
            <td>{length}</td>
        </tr>
    );
}

function LoadingTrackRow({ url }: { url: string }) {
    return useLoading<ITrack>(url, track => <TrackRow {...{ track }} />);
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