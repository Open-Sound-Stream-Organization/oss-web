import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { ISong } from "./Models";
import Api from "./Api";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

interface PlayerData {
    song?: ISong;
    play: (t?: ISong) => void;
    pause: () => void;
    position: number;
    shuffle: boolean;
    repeat: boolean;
    setShuffle: (b: boolean) => void;
    setRepeat: (b: boolean) => void;
    playing: () => boolean;
    volume: number;
    setVolume: (v: number) => void;
    toggleVolume: () => void;
}

const context = createContext<PlayerData>({
    play: () => { },
    pause: () => { },
    position: 0,
    shuffle: false,
    repeat: false,
    setShuffle: () => { },
    setRepeat: () => { },
    playing: () => false,
    volume: 0,
    setVolume: () => { },
    toggleVolume: () => { },
});

export const Provider = context.Provider;

export function usePlayer(): PlayerData {
    return useContext(context);
}

/**
 * Can be used anywhere to access and modify volume
 * TODO This is where the actual volume logic will happen
 */
function useVolume(audio: HTMLAudioElement) {
    const [volume, set] = useState(0.4);
    const [saveVolumed, saveVolume] = useState(volume);

    const setVolume = (v: number) => {
        audio.volume = v;
    }

    useEffect(() => {
        const update = () => set(audio.volume);
        audio.addEventListener('volumechange', update);
        return () => audio.removeEventListener('volumechange', update);
    }, [audio]);

    useEffect(() => {
        audio.volume = volume;
    }, [volume, audio]);

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

export function useCreateAudio(): PlayerData {
    const [song, setSong] = useState<ISong | undefined>(undefined);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(true);
    const [position, setPosition] = useState(0);

    const update = () => setPosition(audio.currentTime);

    const audio = useMemo(() => new Audio(), []);
    const volume = useVolume(audio);

    useEffect(() => {
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [audio])

    const play = async (song?: ISong) => {

        if (song) await Api.audio(song.audio)
            .then(src => {
                setSong(song);

                audio.src = src;
                audio.currentTime = 0;
                audio.play();

            }).catch(e => console.log(e));

        else await audio?.play();
    }

    const pause = () => {
        audio?.pause();
    }

    return {
        song: song ? { ...song, length: audio.duration } : undefined,
        play, pause,
        shuffle, repeat, setShuffle, setRepeat,
        playing: () => !!audio && !audio.paused,
        position,
        ...volume
    };
}

export function SongButton({ song }: { song: ISong }) {
    const { play, pause, playing, song: s } = usePlayer();
    const selected = song.id === s?.id;

    const onClick = () => {
        if (selected) {
            if (playing()) pause();
            else play();
        } else play(song);
    }

    return (
        <button className='song-button' {...{ onClick }}>
            <Icon icon={(selected && playing()) ? faPause : faPlay} />
        </button>
    );
}

export default usePlayer;