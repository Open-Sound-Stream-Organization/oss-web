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

const ignore = [
    'songinplaylist',
    'track',
    'apikey',
]

const Endpoint = ({ endpoint }: { endpoint: string }) => {
    const [models] = useApi<IList<unknown>>(endpoint);
    const count = models?.objects?.length;

    if(models && count === undefined) return null;

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

const Seeder = React.memo(() => {
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const loading = (total > 0);

    const [endpoints] = useApi<IEndpoints>('');

    const seed = () => SEEDER.seed({ setProgress, setTotal, setMessage }).catch(e => console.error(e))

    return (
        <>
            <div className='endpoints'>
                {endpoints && Object.keys(endpoints).filter(e => !ignore.includes(e.toLowerCase())).map(e =>
                    <Endpoint key={e} endpoint={e} />
                )}
            </div>

            <button className={classes({ disabled: loading })} onClick={seed}>
                <p>{loading ? 'Seeding...' : 'Seed!'}</p>
            </button>

            {loading &&
                <>
                    <div className='progress'>
                        <div style={{ width: `${progress / total * 100}%` }} />
                        <p>{progress} / {total}</p>
                    </div>
                    <p>{message}</p>
                </>
            }
        </>
    );
});

export default Seeder;