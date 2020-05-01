import React, { useState, useMemo, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useLoading } from '../api/Hooks';
import { IAlbum, IArtist, ISong, IModel } from '../api/Models';
import usePlayer, { SongButton } from '../api/Audio';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faEdit, IconDefinition, faList } from '@fortawesome/free-solid-svg-icons';
import { useDialog } from './Dialog';
import { LoadedSongEditor } from './Upload';
import classes from 'classnames';

interface ISelection {
    isSelected(id: number): boolean;
    selected: Set<number>;
    events(id: number): {
        onMouseDown(e: React.MouseEvent): void;
        onMouseUp(e: React.MouseEvent): void;
        onMouseMove(e: React.MouseEvent): void;
        onContextMenu(e: React.MouseEvent): void;
    }
}

function useSelection<T extends IModel>(models: T[]): ISelection {
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [saved, setSaved] = useState<Set<number>>(new Set());
    const [last, setLast] = useState<number>();

    const ids = useMemo(() => models.map(m => m.id), [models]);

    const isSelected = (m: T | number) => {
        const id = typeof m === 'number' ? m : m.id;
        return selected.has(id);
    }

    const events = (id: number) => {
        const index = ids.indexOf(id);
        const is = isSelected(id);

        return {
            onMouseDown: (e: React.MouseEvent) => {
                e.preventDefault();
                const preserve = e.shiftKey || e.ctrlKey;
                const n = preserve ? new Set(saved) : new Set<number>();

                if (is && e.ctrlKey) {
                    n.delete(id);
                } else {
                    n.add(id);
                }

                if (!e.shiftKey) {
                    setLast(index);
                    setSaved(n);
                }

                setSelected(n);
            },
            onMouseUp: (e: React.MouseEvent) => {
                e.preventDefault();
                const shift = e.shiftKey;

                setSelected(old => {
                    const n = new Set(old);

                    if (shift && last) {
                        const lower = Math.min(last, index);
                        const upper = Math.max(last, index);
                        for (let i = lower; i <= upper; i++) n.add(ids[i]);
                    }

                    return n;
                })
            },
            onContextMenu: (e: React.MouseEvent) => {
                e.preventDefault();
            },
            onMouseMove: (e: React.MouseEvent) => {
                e.preventDefault();
                if (e.buttons) {
                    const n = new Set(saved);
                    if (last) {
                        const lower = Math.min(last, index);
                        const upper = Math.max(last, index);
                        console.log(lower, upper);
                        for (let i = lower; i <= upper; i++) n.add(ids[i]);
                    }

                    setSelected(n);
                }
            }
        }
    };

    return { selected, isSelected, events };
}

const Songs = ({ songs }: { songs: ISong[] }) => {
    const selection = useSelection(songs);
    if ((songs?.length ?? 0) === 0) return <p className='empty-info'>No songs yet</p>

    return (
        <div className='songlist'>
            <div>
                <p />
                <p>Title</p>
                <p>Artists</p>
                <p>Album</p>
                <p>Length</p>
                <p />
                <p />
            </div>
            {songs.slice(0, 10).map(song =>
                <SongRow
                    {...{ selection }}
                    key={song.id} {...{ song, songs }}
                />
            )}
        </div>
    )
}

const SongRow = (props: { song: ISong | string, selection?: ISelection, songs?: ISong[] }) => {
    const { song, selection, songs } = props;
    const { open } = useDialog();
    const { queue } = usePlayer();

    if (typeof song === 'string') return <LoadingSongRow url={song} {...{ selection }} />

    const { album, artists, title, length, id } = song;
    const selected = selection?.isSelected(id) ?? false;

    return (
        <div className={classes({ selected })} {...selection?.events(id)}>
            <SongButton {...{ song, songs }} />

            <p>{title}</p>
            <p>{artists.map(a =>
                <Artist key={a} url={a} />
            )}</p>
            <p><Album url={album} /></p>
            <p>{length}</p>

            <IconButton icon={faEdit} onClick={() => open(<LoadedSongEditor {...{ song }} />)} />
            <IconButton icon={faList} onClick={() => queue?.add(song)} />

        </div>
    );
}

const IconButton = ({ onClick, icon }: { onClick?: () => void, icon: IconDefinition }) => {

    return <button {...{ onClick }}>
        <Icon {...{ icon }} />
    </button>
}

const LoadingSongRow = ({ url, ...rest }: { url: string, selection?: ISelection }) => {
    return useLoading<ISong>(url, song => <SongRow {...rest} {...{ song }} />);
}

const Artist = ({ url }: { url: string }) => {
    const [a] = useApi<IArtist>(url);
    return a ? <Link className='seperate-comma' to={`/artists/${a.id}`}>{a.name}</Link> : null;
}

const Album = ({ url }: { url: string }) => {
    const [a] = useApi<IAlbum>(url);
    return a ? <Link className='seperate-comma' to={`/albums/${a.id}`}>{a.name}</Link> : null;
}

export default Songs;