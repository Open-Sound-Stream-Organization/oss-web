import React from 'react';
import { Link } from 'react-router-dom';
import { useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, ISong } from '../api/Models';
import { SongButton } from '../api/Audio';

function Songs({ songs }: { songs: (ISong | string)[] }) {
    if ((songs?.length ?? 0) === 0) return <p className='empty-info'>No songs yet</p>
    return (
        <table className='songlist'>
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
                {songs.map(song =>
                    <SongRow key={typeof song === 'string' ? song : song.id} {...{ song: song }} />
                )}
            </tbody>
        </table>
    )
}

function SongRow({ song }: { song: ISong | string }) {
    if (typeof song === 'string') return <LoadingSongRow url={song} />

    const { album, artists, title, length } = song;
    return (
        <tr>
            <td><SongButton {...{ song }} /></td>
            <td>{title}</td>
            <td>{artists.map(a =>
                <Artist key={a} url={a} />
            )}</td>
            <td><Album url={album} /></td>
            <td>{length}</td>
        </tr>
    );
}

function LoadingSongRow({ url }: { url: string }) {
    return useLoading<ISong>(url, song => <SongRow {...{ song }} />);
}

function Artist({ url }: { url: string }) {
    const [a] = useApi<IArtist>(url);
    return a ? <Link className='seperate-comma' to={`/artists/${a.id}`}>{a.name}</Link> : null;
}

function Album({ url }: { url: string }) {
    const [a] = useApi<IAlbum>(url);
    return a ? <Link className='seperate-comma' to={`/albums/${a.id}`}>{a.name}</Link> : null;
}

export default Songs;