import React, { useMemo, useState } from 'react';
import { IPlaylist, ISong, IList } from '../api/Models';
import { ModelView } from './Shared';
import SongList, { useSelection } from './SongList';
import { useApiBunch, useLoading, useApi, Loading } from '../api/Hooks';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDialog } from './Dialog';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import classes from 'classnames';
import API from '../api/Api';

const SongAdder = ({ id, songsinplaylist, resource_uri }: IPlaylist) => {
    const contained = (s: ISong) => songsinplaylist.includes(s.resource_uri);
    const { close } = useDialog();

    const [all, loading] = useApi<IList<ISong>>('song');
    const songs = useMemo(() => all?.objects.filter(s => !contained(s)) ?? [], [all]);

    const { isSelected, events, selected } = useSelection<ISong>(songs);

    const submit = () => {
        Promise.all(selected().map(song =>
            API.post('songinplaylist', { song: song.resource_uri, playlist: resource_uri }, false)
                .catch(e => console.error(e))
        )).then(() => API.update());
        close();
    }

    if (loading) return <Loading />

    return (
        <div className='add-songs demarg'>
            <button className='primary' onClick={submit}>Add selected to playlist</button>
            <ul>
                {songs.map(({ title, id }) =>
                    <li key={id} className={classes({ selected: isSelected(id) })} {...events(id)}>{title}</li>
                )}
            </ul>
        </div>
    );
}

const Active = (playlist: IPlaylist) => {
    const { songsinplaylist: songURLs } = playlist;
    const [songs] = useApiBunch<ISong>(songURLs);
    const { open } = useDialog();

    const remove = (songs: ISong[]) => {

    }

    return <>
        <button onClick={() => open(<SongAdder {...playlist} />)}>
            <Icon icon={faPlus} />
        </button>

        <SongList {...{ songs }} actions={[{
            icon: faTrash,
            display: i => `Remove ${i} song${i === 1 ? '' : 's'}`,
            action: remove,
        }]} />
    </>
}

const Create = () => {
    const [name, setName] = useState('');
    const { close } = useDialog();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        close();
        API.post('playlist', { name })
            .catch(e => console.error(e));
    }

    return <form className='create-playlist' onSubmit={submit}>

        <input className='big' value={name} onChange={e => setName(e.target.value)} type='text' placeholder='Name' />
        <button className='primary' type='submit'>Create</button>

    </form>
}

const Playlists = React.memo(() => {
    return <ModelView
        endpoint='playlist'
        render={(p: IPlaylist) => <Active {...p} />}
        create={() => <Create />}
    />
})

export default Playlists;