import React from 'react';
import SEEDER from "../api/Seeder";
import { useApi } from '../api/Hooks';

function Seeder() {
    const [r] = useApi('');
    console.log(r);

    return (
        <>
            <button>Seed!</button>
        </>
    );
}

export default Seeder;