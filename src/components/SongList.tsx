import { faEdit, faList, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import classes from 'classnames';
import React, { useEffect, useMemo, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/Api';
import usePlayer, { SongButton } from '../api/Audio';
import { Loading, useApi, useLoading, useApiList } from '../api/Hooks';
import { IAlbum, IArtist, IList, IModel, IPlaylist, ISong } from '../api/Models';
import { useDialog } from './Dialog';
import { LoadedSongEditor } from './Upload';

interface ISelection<T> {
    isSelected(id: number): boolean;
    selected: () => T[];
    events(id: number): {
        onMouseDown(e: React.MouseEvent): void;
        onMouseUp(e: React.MouseEvent): void;
        onMouseMove(e: React.MouseEvent): void;
    }
}

//
export function useSelection<T extends IModel>(models: T[], multi = true): ISelection<T> {
    const [selected, setSelected] = useState<number[]>([]);
    const [saved, setSaved] = useState<number[]>([]);
    const [last, setLast] = useState<number>();

    const ids = useMemo(() => models.map(m => m.id), [models]);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.keyCode === 65) {
                e.preventDefault();
                setSelected([...ids]);
                setSaved([...ids]);
            }
        }
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);;
    })

    const isSelected = (m: T | number) => {
        const id = typeof m === 'number' ? m : m.id;
        return selected.includes(id);
    }

    const events = (id: number) => {
        const index = ids.indexOf(id);
        const is = isSelected(id);

        return {
            onMouseDown: (e: React.MouseEvent) => {
                const preserve = (e.shiftKey || e.ctrlKey) && multi;
                const n = preserve ? saved : [];

                if (is && e.ctrlKey && multi) {
                    n.splice(index, 1);
                } else {
                    n.push(id);
                }

                if (!e.shiftKey) {
                    setLast(index);
                    setSaved(n);
                }

                setSelected(n);
            },
            onMouseUp: (e: React.MouseEvent) => {
                const shift = e.shiftKey;

                if (multi && shift && last !== undefined) setSelected(old => {
                    const n = [...old];

                    const lower = Math.min(last, index);
                    const upper = Math.max(last, index);
                    for (let i = lower; i <= upper; i++) n.push(ids[i]);

                    return n;
                })
            },
            onMouseMove: (e: React.MouseEvent) => {
                if (e.buttons) {
                    const n = [...saved];
                    if (last !== undefined) {
                        const lower = Math.min(last, index);
                        const upper = Math.max(last, index);
                        for (let i = lower; i <= upper; i++) n.push(ids[i]);
                    }
                    setSelected(n);
                }
            }
        }
    };

    return { selected: () => models.filter(m => isSelected(m.id)), isSelected, events };
}

export interface SongAction {
    icon: IconDefinition;
    display: string | ((i: number) => string);
    action: (songs: ISong[]) => void;
}

//Song kann zu einer bereits existierenden Playlist hinzugefügt werden
//ansonsten kann eine neue Playlist erstellt werden
const SongAdder = ({ songs }: { songs: ISong[] }) => {
    const { close } = useDialog();

    const [playlists] = useApiList<IPlaylist>('playlist');

    const { isSelected, events, ...selection } = useSelection<IPlaylist>(playlists ?? [], false);
    const [selected]: (IPlaylist | undefined)[] = selection.selected();

    const submit = () => {
        Promise.all(songs.filter(s => isSelected(s.id)).map(song =>
            API.post('songinplaylist', { song: song.resource_uri, playlist: selected.resource_uri }, false)
                .catch(e => console.error(e))
        )).then(() => API.update());
        close();
    }

    if (!playlists) return <Loading />

    return (
        <div className='add-songs demarg'>
            <button className={classes('primary', { disabled: !selected })} onClick={submit}>
                Add {songs.length} to playlist
            </button>
            <ul>
                {playlists.map(({ name, id }) =>
                    <li key={id} className={classes({ selected: isSelected(id) })} {...events(id)}>{name}</li>
                )}
            </ul>
        </div>
    );
}

//mehrere Songs können zu einer Playlist hinzugefügt werden
const Songs = memo(({ songs, ...props }: { songs: ISong[], actions?: SongAction[] }) => {
    const selection = useSelection(songs);
    const { open } = useDialog();

    const actions = useMemo(() => [...props.actions ?? [], {
        icon: faPlus,
        display: i => `Add ${i} song${i === 1 ? '' : 's'} to playlist`,
        action: songs => open(<SongAdder {...{ songs }} />)
    }], [props.actions]);
    
    if ((songs?.length ?? 0) === 0) return <p style={{ gridArea: 'songs' }} className='empty-info'>No songs yet</p>

    const selected = selection.selected();

    return (
        <div className='songlist'>
            <div className='actions'>
                {(selected.length > 0) ? actions.map(({ icon, display, action }, i) => {
                    const text = typeof display === 'string' ? display : display(selected.length);

                    return (
                        <button key={i} className={classes({ disabled: selected.length === 0 })} onClick={() => action(selected)}>
                            <Icon {...{ icon }} />
                            <span>{text}</span>
                        </button>
                    )

                }) : <p className='empty-info'>No songs selected</p>}
            </div>
            <div className='table'>
                <div>
                    <p />
                    <p>Title</p>
                    <p>Artists</p>
                    <p>Album</p>
                    <p>Length</p>
                    <p />
                    <p />
                </div>
                {songs.map(song =>
                    <SongRow
                        {...{ selection }}
                        key={song.id} {...{ song, songs }}
                    />
                )}
            </div>
        </div>
    )
});

//Song kann zu einer Queue hinzugefügt werden
const SongRow = (props: { song: ISong | string, selection?: ISelection<ISong>, songs?: ISong[] }) => {
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

const LoadingSongRow = ({ url, ...rest }: { url: string, selection?: ISelection<ISong> }) => {
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