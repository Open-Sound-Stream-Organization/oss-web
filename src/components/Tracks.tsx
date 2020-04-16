import React, { useState, useRef } from 'react';
import { ITrack, IList } from '../api/Models';
import { Link } from 'react-router-dom';
import { useLoading } from '../api/Hooks';
import TrackList from './TrackList';
import API from '../api/FakeApi';

function Tracks() {
    return useLoading<IList<ITrack>>('track', ({ objects }) =>
        <TrackList tracks={objects} />
    )
}

export default Tracks;