import React from 'react';
import { Link } from 'react-router-dom';
import { useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, ISong } from '../api/Models';
import { SongButton } from '../api/Audio';

function Songs({ songs }: { songs: (ISong | string)[] }) {
    if ((songs?.length ?? 0) === 0) return <p className='empty-info'>No songs yet</p>
    return (
        <div className='songlist'>
            <div>
                <p id='play'></p>
                <p id='title'>Title</p>
                <p id='artists'>Artists</p>
                <p id='album'>Album</p>
                <p id='length'>Length</p>
            </div>
            {songs.map(song =>
                <SongRow key={typeof song === 'string' ? song : song.id} {...{ song: song }} />
            )}
        </div>
    )
}

function SongRow({ song }: { song: ISong | string }) {
    if (typeof song === 'string') return <LoadingSongRow url={song} />

    const { album, artists, title, length } = song;
    return (
        <div>
            <p><SongButton {...{ song }} /></p>
            <p>{title}</p>
            <p>{artists.map(a =>
                <Artist key={a} url={a} />
            )}</p>
            <p><Album url={album} /></p>
            <p>{length}</p>
        </div>
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