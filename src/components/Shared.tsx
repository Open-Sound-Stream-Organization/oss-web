import { faCompactDisc, faDrum, faGuitar, faHeadphones, faMusic, faPlus, faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import classes from 'classnames';
import React, { CSSProperties, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Render, useLoading, useLoadingList } from '../api/Hooks';
import { IModel } from '../api/Models';
import Cell from './Cell';
import { useDialog } from './Dialog';
import API from '../api/Api';

const ICONS = [faHeadphones, faMusic, faGuitar, faDrum, faRecordVinyl, faCompactDisc];

export const Cover = (props: { alt: string, src?: string } & CSSProperties) => {
    const { src, alt, ...rest } = props;
    const [hasImage, setImage] = useState(false);

    const icon = useMemo(() => ICONS[Math.floor(Math.random() * ICONS.length)], [])

    return <Cell area='cover' style={{ ...rest }}>
        <img
            onLoad={() => setImage(true)}
            onError={() => setImage(false)}
            draggable={false}
            {... { alt, src }}
        />
        {!hasImage && <Icon icon={icon} />}
    </Cell>
}

export function ModelView<M extends IModel>(props: { endpoint: string, render: Render<M>, create?: (() => JSX.Element) | true }) {
    const { endpoint, create } = props;
    const { id } = useParams();

    return (
        <>
            <ModelSidebar {...{ endpoint, create }} />
            <Cell area='active'>
                {id
                    ? <Single {...{ id }} {...props} />
                    : <h1>Select a{endpoint.match(/^[aeiou]/i) ? 'n' : ''} {endpoint}</h1>
                }
            </Cell>
        </>
    )
}

function Single<M extends IModel>(props: { endpoint: string, id: string, render: Render<M> }) {
    const { id, endpoint, render } = props;
    return useLoading<M>(`${endpoint}/${id}`, m =>
        <>
            <h1>{m.name}</h1>
            {render(m)}
        </>
    );
}

const Create = ({ endpoint }: { endpoint: string }) => {
    const [name, setName] = useState('');
    const { close } = useDialog();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        close();
        API.post(endpoint, { name })
            .catch(e => console.error(e));
    }

    const disabled = name.length < 1;

    return <form className='create' onSubmit={submit}>

        <input className='big' value={name} onChange={e => setName(e.target.value)} type='text' placeholder='Name' />
        <button className={classes('primary', { disabled })} type='submit'>Create</button>

    </form>
}

export function ModelSidebar<M extends IModel>({ endpoint, ...props }: { endpoint: string, create?: (() => JSX.Element) | boolean }) {
    const { id: active } = useParams();
    const { open } = useDialog();

    const create = props.create ? () => {
        if (typeof props.create === 'function') return props.create();
        return <Create {...{ endpoint }} />
    } : null;

    return useLoadingList<M>(endpoint, models =>
        <Cell area='list'>
            {create && <button onClick={() => open(create())}>
                <Icon icon={faPlus} />
            </button>}
            <ul className='list'>
                {(models.length > 0)
                    ? models.map(({ name, id }) =>
                        <Link key={id} to={`/${endpoint}s/${id}`}>
                            <li className={classes({ active: id.toString() === active })}>
                                {name}
                            </li>
                        </Link>
                    )
                    : <li className='empty-info'>No {endpoint}s yet</li>
                }
            </ul>
        </Cell>
    );
}