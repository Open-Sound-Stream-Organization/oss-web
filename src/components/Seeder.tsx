import React, { useState } from 'react';
import SEEDER from "../api/Seeder";
import classes from 'classnames';

function Seeder() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <button className={classes({ disabled: loading })} onClick={() => {

                setLoading(true);
                SEEDER.seed()
                    .catch(e => console.error(e))
                    .then(() => setLoading(false));

            }}>
                {loading ? 'Seeding...' : 'Seed!'}
            </button>
        </>
    );
}

export default Seeder;