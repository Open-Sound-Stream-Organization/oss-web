import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import { useLocation } from 'react-router-dom';
import '../style/general.scss';
import Cell from './Cell';
import { useApi } from '../api/Hooks';
import { IPlaylist } from '../api/Models';


function Playlist() {

    const [playlists] = useApi<IPlaylist[]>('playlist');
    if (!playlists) return <p>Loading</p>

    return (
        <Cell area='playlists'>
            <Jumbotron fluid className="Playlist">
                <Container>
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
                </Container>
            </Jumbotron>
        </Cell>
    );
}

export default Playlist;

