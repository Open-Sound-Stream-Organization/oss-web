import React from 'react';
import { ITrack } from '../api/Models';
import { Link } from 'react-router-dom';
import { useLoading } from '../api/Hooks';
import TrackList from './TrackList';

function Tracks() {
    return useLoading<ITrack[]>('track', tracks =>
        <TrackList {...{ tracks }} />
    )
}

export default Tracks;