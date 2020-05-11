import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import classes from 'classnames';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { useMessages } from "../components/Message";
import Api from "./Api";
import { ISong } from "./Models";

export interface IQueue {
    songs: ISong[];
    add: (s: ISong) => void;
    remove: (i: number) => void;
}

interface PlayerData {
    song?: ISong;
    play: (song?: ISong | ISong[], songs?: ISong[]) => void;
    pause: () => void;
    next?: () => void,
    previous?: () => void,
    position: number;
    shuffle: boolean;
    repeat: boolean;
    setShuffle: Dispatch<SetStateAction<boolean>>;
    setRepeat: Dispatch<SetStateAction<boolean>>;
    playing: () => boolean;
    queue?: IQueue;
    songs: ISong[];
}

const Context = createContext<PlayerData & { audio: HTMLAudioElement } | null>(null);

export const Provider = Context.Provider;

export const usePlayer: () => PlayerData = () => {
    const context = useContext(Context);
    if (!context) throw new Error('There is no player defined');
    return context;
}

/**
 * Can be used anywhere to access and modify volume
 * TODO This is where the actual volume logic will happen
 */
export const useVolume = () => {
    const context = useContext(Context);
    if (!context) throw new Error('There is no player defined');
    const { audio } = context;

    const [volume, set] = useState(0.4);
    const [saveVolumed, saveVolume] = useState(volume);

    const setVolume = (v: number) => {
        const clamped = Math.min(1, Math.max(0, v));
        set(clamped);
        audio.volume = clamped;
    }

    useEffect(() => {
        const update = () => set(v => {
            if (audio.volume !== v) return audio.volume;
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

export const useQueue = (setSong: Dispatch<SetStateAction<ISong | undefined>>) => {
    const [songs, setSongs] = useState<ISong[]>([]);
    const messages = useMessages();

    const add = (s: ISong) => {
        setSongs(old => [...old, s]);
        messages.add({ text: `Added ${s.title} to the queue`, type: 'success' });
    }

    const remove = (index: number) => {
        setSongs(old => {
            const n = [...old]
            n.splice(index, 1);
            return n;
        })
    }

    return { songs, add, remove } as IQueue;
}

export const useCreateAudio = () => {
    const [song, setSong] = useState<ISong>();
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(true);
    const [position, setPosition] = useState(0);

    const [unshuffled, setSongs] = useState<ISong[]>([]);
    const shuffled = useMemo(() => [...unshuffled].sort(() => Math.random() - 0.5), [unshuffled]);
    const songs = shuffle ? shuffled : unshuffled;
    const [index, setIndex] = useState(0);

    const audio = useMemo(() => {
        const a = new Audio()
        a.crossOrigin = 'anonymous';
        return a;
    }, []);
    const queue = useQueue(setSong) as IQueue | undefined;

    useEffect(() => {
        const update = () => setPosition(audio.currentTime);
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [audio])

    const play = async (song?: ISong | ISong[], songs?: ISong[]) => {
        const ss = Array.isArray(song) ? song : songs;
        const s1 = Array.isArray(song) ? undefined : song;
        const s = s1 ?? (ss ? ss[0] : undefined);

        if (ss && s) {
            setIndex(ss.indexOf(s));
        }

        setSongs([...(ss ?? [])]);

        if (s?.audio) await Api.audio(s.audio)
            .then(src => {
                setSong(s);

                audio.src = src;
                audio.currentTime = 0;
                audio.play();

            }).catch(e => {
                setSong(undefined);
                console.error(e)
            });

        else await audio?.play();
    }

    const pause = () => {
        audio?.pause();
    }

    const previous = undefined;

    const next = (() => {
        if (queue?.songs[0]) return () => {
            play(queue.songs[0]);
            queue.remove(0);
        }
        else {
            const i = index + 1;
            if (songs.length > 0 && (i < songs.length || repeat)) return () => {
                play(songs[i % songs.length]);
            };
        }
    })();

    return {
        song: song ? { ...song, length: audio.duration } : undefined,
        play, pause, next, previous,
        shuffle, repeat, setShuffle, setRepeat,
        playing: () => !!audio && !audio.paused,
        position,
        queue,
        audio,
        songs: songs.slice(index + 1, index + 11),
    };
}

export const SongButton = ({ song, songs }: { song: ISong, songs?: ISong[] }) => {
    const { play, pause, playing, song: s } = usePlayer();
    const selected = song.id === s?.id;
    const disabled = !song.audio;

    const onClick = () => {
        if (selected) {
            if (playing()) pause();
            else play();
        } else play(song, songs);
    }

    return (
        <button className={classes('song-button', { disabled })} {...{ onClick }}>
            <Icon icon={(selected && playing()) ? faPause : faPlay} />
        </button>
    );
}

export default usePlayer;