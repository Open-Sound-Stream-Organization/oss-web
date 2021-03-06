import { faCheck, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import classes from 'classnames';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/Api';
import { Loading, useApiList, useLoading } from '../api/Hooks';
import { IAlbum, IModel, ISong } from '../api/Models';
import Cell from './Cell';
import { useDialog } from './Dialog';

const fileName = (f: File) => f.name.substring(0, f.name.lastIndexOf('.'));

const Upload = React.memo(() => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<File[]>([]);

    const upload = () => {
        setUploading(u => [...files, ...u])
        setFiles([]);
    }

    return (
        <>
            <form onSubmit={e => {
                e.preventDefault();
                upload();
            }}>

                <label role="button" className="file" htmlFor="file">
                    <span>Choose Files</span>
                    <Icon icon={faUpload} />
                </label>

                <input onChange={e => setFiles([...(e.target.files ?? []) as File[]])} multiple id="file" type="file" accept="audio/mp3" hidden />

                <button className={classes({ disabled: files.length === 0 })} type="submit">
                    Upload {files.length ? `${files.length} Song` : ''}
                </button>

            </form>

            <ul className='uploading'>
                {uploading.map(f => <Uploading key={f.name} file={f} />)}
            </ul>
        </>
    )
});

const Uploading = ({ file }: { file: File }) => {
    const [done, setDone] = useState(false);
    const name = fileName(file);

    useEffect(() => {
        setDone(false);
        API.upload('song', file)
            .catch(e => console.error(e))
            .then(() => setDone(true))
    }, [file]);

    return (
        <li className={classes({ done })}>
            {done
                ? <Icon icon={faCheck} />
                : <Loading />
            }
            <span>{name}</span>
        </li>
    );
}

type State<T> = [T, Dispatch<SetStateAction<T>>];

export function ModelSelect<T extends IModel>(props: { endpoint: string, state: State<string | null>, name?: string, highlight?: (t: T) => boolean }) {
    const { endpoint, state, name, highlight } = props;
    const [initial, onChange] = state;
    const [create, setCreate] = useState(false);

    const [models] = useApiList<T>(endpoint);

    const sorted = useMemo(() => {
        if (!highlight || !models) return models ?? [];
        return [...models].sort((a, b) => {
            const [ia, ib] = [a, b].map(highlight).map(b => b ? -1 : 1);
            return ia - ib;
        });
    }, [highlight, models]);

    const set = (v: string) => {
        if (v === 'create') setCreate(true)
        else {
            setCreate(false);
            const v2 = v.length > 0 ? v : null;
            onChange(v2);
        }
    }

    return <>
        <select value={initial ?? ''} id={name ?? endpoint} name={name ?? endpoint} onChange={e => set(e.target.value)}>
            {sorted.length > 0 &&
                <>
                    <option value=''>Select an {endpoint}</option>
                    <option value='create'>Create an {endpoint}</option>
                    {sorted.map(m =>
                        <option
                            className={classes({ highlight: highlight && highlight(m) })}
                            key={m.id}
                            value={m.resource_uri}>
                            {m.name}
                        </option>
                    )}
                </>
            }
        </select>
        {create && <input type='text' />}
    </>

}

export const MultiModelSelect = (props: { endpoint: string, state: State<string[]> }) => {
    const { endpoint, state } = props;
    const [initial, onChange] = state;
    const [models, set] = useState<(null | string)[]>(initial.length > 0 ? initial : [null]);

    useEffect(() => {
        onChange(models.filter(m => !!m) as string[]);
    }, [models]);

    return <div className='multi-select'>
        {models.map((model, i) =>
            <ModelSelect name={`${endpoint}[]`} key={i} {...{ endpoint }} state={[
                model, action => {
                    const n = [...models];
                    const a = typeof action === 'function' ? action(model) : action;

                    if (a || i === 0) n[i] = a;
                    else n.splice(i, 1);

                    set(n);
                }
            ]} />
        )}
        {models[models.length - 1] && <button onClick={() => set([...models, null])}>Add</button>}
    </div>;
}

export const SongEditor = () => {
    const { id } = useParams();
    return useLoading<ISong>(`song/${id}`, s => <LoadedSongEditor song={s} />)
}

export const LoadedSongEditor = ({ song }: { song?: ISong }) => {
    const { close } = useDialog();

    const [title, setTitle] = useState<string>(song?.title ?? '');
    const [album, setAlbum] = useState<null | string>(song?.album ?? null);
    const [artists, setArtists] = useState<string[]>(song?.artists ?? []);

    const highlight = useMemo(() => (album: IAlbum) =>
        artists.every(a => album.artists.includes(a)), [artists]
    );

    const data = { artists, album, title };

    return (
        <form className='editor' onSubmit={e => {
            e.preventDefault();
            close();
            if (song) API.put(`song/${song.id}`, data)
                .catch(e => console.error(e))
        }}>

            <Cell area='title'>
                <label htmlFor='title'>Title</label>
                <input className='big' id='title' type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
            </Cell>

            <Cell area='artists'>
                <label>Artists</label>
                <MultiModelSelect endpoint='artist' state={[artists, setArtists]} />
            </Cell>

            <Cell area='album'>
                <label htmlFor='album'>Album</label>
                <ModelSelect endpoint='album' state={[album, setAlbum]} {...{ highlight }} />
            </Cell>

            <input type='submit' className='primary' value='Save' />

        </form>
    )
}

export default Upload;

