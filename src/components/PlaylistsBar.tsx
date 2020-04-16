import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import { Loading, useApi } from '../api/Hooks';
import { IPlaylist } from '../api/Models';
import '../style/general.scss';
import Cell from './Cell';


function Playlist() {

    const [playlists] = useApi<IPlaylist[]>('playlist');
    if (!playlists) return <Loading />

    return (
        <Cell area='playlists'>
           <div>
                    <ul>
                        {playlists.map((list) =>
                            <ListGroup className="ListGroup" variant="flush">
                                <ListGroup.Item action href="info">{list.name}</ListGroup.Item>
                                {/*
                                     <ListGroup.Item action variant = "info"></ListGroup.Item>
                                    <ListGroup.Item action variant = "info">playlist2</ListGroup.Item> 
                                */}
                            </ListGroup>
                        )}
                    </ul>
               </div>
        </Cell>
    );
}

export default Playlist;

