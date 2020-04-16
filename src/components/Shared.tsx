import classes from 'classnames';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Render, useLoading } from '../api/Hooks';
import { IList, IModel } from '../api/Models';
import Cell from './Cell';

export function ModelView<M extends IModel>(props: { endpoint: string, render: Render<M> }) {
    const { endpoint } = props;
    const { id } = useParams();

    return (
        <>
            <ModelSidebar {...{ endpoint }} />
            <Cell area='active'>
                {id
                    ? <Single {...{ id }} {...props} />
                    : <h1>Select a{endpoint.match(/^[aeiou]/i) ? 's' : ''} {endpoint}</h1>
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

export function ModelSidebar<M extends IModel>({ endpoint }: { endpoint: string }) {
    const { id: active } = useParams();

    return useLoading<IList<M>>(endpoint, ({ objects }) =>
        <Cell area='list'>
            <ul className='list'>
                {objects.map(({ name, id }) =>
                    <li key={id} className={classes({ active: id.toString() === active })}>
                        <Link to={`/${endpoint}s/${id}`}>
                            {name}
                        </Link>
                    </li>
                )}
            </ul>
        </Cell>
    );
}