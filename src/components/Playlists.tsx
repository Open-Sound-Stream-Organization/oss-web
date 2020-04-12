import React from 'react';
import { useLoading } from '../api/Hooks';
import { IPlaylist } from '../api/Models';
import { useDialog } from './Dialog';

function Playlists() {
    const { open } = useDialog();

    return useLoading<IPlaylist[]>('playlist', playlists =>
        <>
            {playlists.map(({ name, id }) =>
                <p key={id} onClick={() => open({
                    text: `Delete ${name}?`,
                    buttons: [
                        { text: 'Yes' },
                        { text: 'Cancel' },
                    ],
                })}>{name}</p>
            )}
        </>
    );
}

export default Playlists;