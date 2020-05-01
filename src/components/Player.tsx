import React, { useState, MouseEvent } from 'react';
import Cell from './Cell';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlay, faStepForward, faStepBackward, faRandom, faVolumeDown, faVolumeUp, faVolumeMute, faRedoAlt, faPause, faList } from '@fortawesome/free-solid-svg-icons'
import { IArtist, ISong } from '../api/Models';
import { useApi } from '../api/Hooks';
import usePlayer, { IQueue, useVolume } from '../api/Audio';
import { useDialog } from './Dialog';
import classes from 'classnames';
import { setPriority } from 'os';

const IconButton = (props: { icon: IconDefinition, area?: string, onClick?: () => unknown, disabled?: boolean, active?: boolean }) => {
    const { area, icon, disabled, onClick, active } = props;
    return (
        <Cell className={classes('icon-button', { disabled: disabled || !onClick, active })} area={area ?? ''} {...{ onClick }}>
            <Icon {...{ icon }} />
        </Cell >
    )
}

const Player = () => {
    const { song, position, play, pause, playing, songs, previous, next, shuffle, setShuffle, repeat, setRepeat } = usePlayer();
    const { open } = useDialog();

    return (
        <Cell area='player'>
            {song && <SongInfo {...song} {...{ position }} />}

            <IconButton onClick={previous} icon={faStepBackward} area='previous' />
            <IconButton onClick={next} icon={faStepForward} area='next' />
            <IconButton onClick={playing() ? pause : () => play()} icon={playing() ? faPause : faPlay} area='play' />
            <IconButton active={shuffle} onClick={() => setShuffle(b => !b)} icon={faRandom} area='shuffle' />
            <IconButton active={repeat} onClick={() => setRepeat(b => !b)} icon={faRedoAlt} area='repeat' />
            <IconButton disabled={songs.length === 0} icon={faList} area='queue' onClick={() => open(<Queue />)} />

            <Volume />
        </Cell>
    );
}

const Queue = () => {
    const { songs } = usePlayer();

    return (
        <div className='queue'>
            {songs.map(({ title, id }) =>
                <p key={id}>{title}</p>
            )}
        </div>
    );
}

const timestamp = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds.toFixed(0).padStart(2, '0')}`;
}

const SongInfo = (song: ISong & { position: number }) => {
    const { title, artists, length, position } = song;

    return (
        <Cell area='info'>
            <h4>{title}</h4>
            <p>{artists?.map(a => <Artist key={a} url={a} />)}</p>
            <div className='song-progress'>
                <span>{timestamp(position)}</span>
                <span>-{timestamp(length - position)}</span>
                <div style={{ width: `${position / length * 100}%` }} />
            </div>
        </Cell>
    );
}

const Artist = ({ url }: { url: string }) => {
    const [a] = useApi<IArtist>(url);
    return a ? <span>{a.name}</span> : null;
}

const Volume = () => {
    const { volume, setVolume, toggleVolume } = useVolume();

    const icon = volume === 0
        ? faVolumeMute
        : volume < 0.5
            ? faVolumeDown
            : faVolumeUp

    const adjust = (e: MouseEvent<HTMLDivElement>) => {
        const w = e.currentTarget.offsetWidth;
        const l = e.currentTarget.getBoundingClientRect().left;
        const x = e.clientX - l;
        const v = x / w;
        setVolume(v);
    }

    return (
        <Cell area='volume'>
            <IconButton {...{ icon }} onClick={toggleVolume} />
            <div className='bar' onClick={adjust} onMouseMove={e => {
                if (e.buttons > 0) adjust(e);
            }}>
                <div style={{ width: `${volume * 100}%` }} />
            </div>
        </Cell>
    );
}

export default Player;