import React from 'react';
import { ITrack } from '../api/Models';
import { Link } from 'react-router-dom';

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
                {tracks.map(({ album, artist, title, length }) =>
                    <tr>
                        <td>{title}</td>
                        <td>{artist.map(a =>
                            <Link className='seperate-comma' to={`artist/${a.id}`}>{a.name}</Link>
                        )}</td>
                        <td><Link to={`album/${album.id}`}>{album.name}</Link></td>
                        <td>{length}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default TrackList;