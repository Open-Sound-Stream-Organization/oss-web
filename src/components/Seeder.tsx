import React, { useState } from 'react';
import SEEDER from "../api/Seeder";
import classes from 'classnames';
import { useApi, Loading } from '../api/Hooks';
import { IList } from '../api/Models';

interface IEndpoints {
    [key: string]: {
        list_endpoint: string,
        schema: string
    }
}

function Endpoint({ endpoint }: { endpoint: string }) {
    const [models] = useApi<IList<unknown>>(endpoint);
    const count = models?.objects.length;

    return (
        <div>
            <p>{endpoint}</p>
            <p>
                {models
                    ? `${count} model${count === 1 ? '' : 's'}`
                    : <Loading />
                }
            </p>
        </div>
    )
}

function Seeder() {
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const loading =(total > 0);

    const [endpoints] = useApi<IEndpoints>('');

    const seed = () => SEEDER.seed({ setProgress, setTotal }).catch(e => console.error(e))

    return (
        <>
            <div className='endpoints'>
                {endpoints && Object.keys(endpoints).filter(e => e !== 'apikey').map(e =>
                    <Endpoint key={e} endpoint={e} />
                )}
            </div>

            <button className={classes({ disabled: loading })} onClick={seed}>
                <p>{loading ? 'Seeding...' : 'Seed!'}</p>
            </button>

            {loading &&
                <div className='progress'>
                    <div style={{ width: `${progress / total * 100}%` }} />
                    <p>{progress} / {total}</p>
                </div>
            }
        </>
    );
}

export default Seeder;