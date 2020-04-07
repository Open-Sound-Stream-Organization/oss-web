import React, { useState, MouseEvent } from 'react';
import Cell from './Cell';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlay, faStepForward, faStepBackward, faRandom, faVolumeDown, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { IActiveTrack } from '../Models';

function IconButton(props: { icon: IconDefinition, area?: string, onClick?: () => unknown }) {
    const { area, icon, ...rest } = props;
    return (
        <Cell className='icon-button' area={area ?? ''} {...rest}>
            <Icon {...{ icon }} />
        </Cell >
    )
}

function Player(track: IActiveTrack) {
    return (
        <Cell area='player'>
            <TrackInfo {...track} />

            <IconButton icon={faStepBackward} area='previous' />
            <IconButton icon={faStepForward} area='next' />
            <IconButton icon={faPlay} area='play' />
            <IconButton icon={faRandom} area='shuffle' />

            <Volume />
        </Cell>
    );
}

function timestamp(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function TrackInfo(track: IActiveTrack) {
    const { name, artist, length, position } = track;

    return (
        <Cell area='info'>
            <h4>{name}</h4>
            <p>{artist.name}</p>
            <div className='progress'>
                <span>{timestamp(position)}</span>
                <span>-{timestamp(length - position)}</span>
                <div style={{ width: `${position / length * 100}%` }} />
            </div>
        </Cell>
    );
}

/**
 * Can be used anywhere to access and modify volume
 * TODO This is where the actual volume logic will happen
 */
export function useVolume() {
    const [volume, setVolume] = useState(40);
    const [saveVolumed, saveVolume] = useState(volume);

    const toggleVolume = () => {
        if (volume > 0) {
            saveVolume(volume);
            setVolume(0);
        } else {
            setVolume(saveVolumed);
        }
    }

    return { volume, setVolume, toggleVolume };
}

function Volume() {
    const { volume, setVolume, toggleVolume } = useVolume();

    const icon = volume === 0
        ? faVolumeMute
        : volume < 50
            ? faVolumeDown
            : faVolumeUp

    const adjust = (e: MouseEvent<HTMLDivElement>) => {
        console.log(e.buttons);
        const w = e.currentTarget.offsetWidth;
        const l = e.currentTarget.getBoundingClientRect().left;
        const x = e.clientX - l;
        const v = Math.round(x / w * 100)
        setVolume(v);
    }

    return (
        <Cell area='volume'>
            <IconButton {...{ icon }} onClick={toggleVolume} />
            <div className='bar' onClick={adjust} onMouseMove={e => {
                if (e.buttons > 0) adjust(e);
            }}>
                <div style={{ width: `${volume}%` }} />
            </div>
        </Cell>
    );
}

export default Player;