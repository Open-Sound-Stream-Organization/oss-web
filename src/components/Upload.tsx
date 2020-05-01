import classes from 'classnames';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useApi, useSubmit, useLoading } from '../api/Hooks';
import { IAlbum, IList, IModel, ISong } from '../api/Models';
import div from './Cell';
import { useParams } from 'react-router-dom';
import Cell from './Cell';

const Upload = React.memo(() => {
    return (
        <>
            <SongEditor />
        </>
    )
});

type State<T> = [T, Dispatch<SetStateAction<T>>];

export function ModelSelect<T extends IModel>(props: { endpoint: string, state: State<string | null>, name?: string, highlight?: (t: T) => boolean }) {
    const { endpoint, state, name, highlight } = props;
    const [current, onChange] = state;

    const [models] = useApi<IList<T>>(endpoint);

    const sorted = useMemo(() => {
        if (!highlight || !models) return models?.objects ?? [];
        return models.objects.sort((a, b) => {
            const [ia, ib] = [a, b].map(highlight).map(b => b ? -1 : 1);
            return ia - ib;
        });
    }, [highlight, models]);

    const set = (v: string) => {
        const v2 = v.length > 0 ? v : null;
        onChange(v2);
    }

    return (
        <select id={name ?? endpoint} name={name ?? endpoint} onChange={e => set(e.target.value)}>
            <option value=''>Select an {endpoint}</option>
            {sorted.map(m =>
                <option
                    className={classes({ highlight: highlight && highlight(m) })}
                    key={m.id}
                    value={m.resource_uri}>
                    {m.name}
                </option>
            )}
        </select>
    )
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
            console.log(data);
        }}>

            <Cell area='title'>
                <label htmlFor='title'>Title</label>
                <input id='title' type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
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

