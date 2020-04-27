import React, { useState, useEffect, useMemo, createContext, useContext, Dispatch, SetStateAction } from "react";
import { ISong } from "./Models";
import Api from "./Api";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

export interface IQueue {
    songs: ISong[];
    add: (s: ISong) => void;
    remove: (i: number) => void;
}

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
    queue?: IQueue;
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
        const clamped = Math.min(1, Math.max(0, v));
        set(clamped);
        audio.volume = clamped;
    }

    useEffect(() => {
        const update = () => set(v => {
            if(audio.volume !== v) return audio.volume;
            return v;
        });
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

function useQueue(setSong: Dispatch<SetStateAction<ISong | undefined>>): IQueue {
    const [songs, setSongs] = useState<ISong[]>([]);

    const add = (s: ISong) => {
        setSongs(old => [...old, s]);
    }

    const remove = (index: number) => {
        setSongs(old => {
            const n = [...old]
            n.splice(index, 1);
            return n;
        })
    }

    return { songs, add, remove };
}

export function useCreateAudio(): PlayerData {
    const [song, setSong] = useState<ISong>();
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(true);
    const [position, setPosition] = useState(0);


    const audio = useMemo(() => new Audio(), []);
    const volume = useVolume(audio);
    const queue = useQueue(setSong);

    useEffect(() => {
        const update = () => setPosition(audio.currentTime);
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
        ...volume,
        queue
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