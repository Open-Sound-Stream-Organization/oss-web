import React, { useState, MouseEvent } from 'react';
import Cell from './Cell';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlay, faStepForward, faStepBackward, faRandom, faVolumeDown, faVolumeUp, faVolumeMute, faRedoAlt, faPause, faList } from '@fortawesome/free-solid-svg-icons'
import { IArtist, ISong } from '../api/Models';
import { useApi } from '../api/Hooks';
import usePlayer, { IQueue } from '../api/Audio';
import { useDialog } from './Dialog';

function IconButton(props: { icon: IconDefinition, area?: string, onClick?: () => unknown }) {
    const { area, icon, ...rest } = props;
    return (
        <Cell className='icon-button' area={area ?? ''} {...rest}>
            <Icon {...{ icon }} />
        </Cell >
    )
}

function Player() {
    const { song, position, play, pause, playing, queue } = usePlayer();
    const { open } = useDialog();

    return (
        <Cell area='player'>
            {song && <SongInfo {...song} {...{ position }} />}

            <IconButton icon={faStepBackward} area='previous' />
            <IconButton icon={faStepForward} area='next' />
            <IconButton onClick={playing() ? pause : () => play()} icon={playing() ? faPause : faPlay} area='play' />
            <IconButton icon={faRandom} area='shuffle' />
            <IconButton icon={faRedoAlt} area='repeat' />
            <IconButton icon={faList} area='queue' onClick={open()} />

            <Volume />
        </Cell>
    );
}

function Queue(queue: IQueue) {
    return (
        <>

        </>
    );
}

function timestamp(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds.toFixed(0).padStart(2, '0')}`;
}

function SongInfo(song: ISong & { position: number }) {
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

function Artist({ url }: { url: string }) {
    const [a] = useApi<IArtist>(url);
    return a ? <span>{a.name}</span> : null;
}

function Volume() {
    const { volume, setVolume, toggleVolume } = usePlayer();

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