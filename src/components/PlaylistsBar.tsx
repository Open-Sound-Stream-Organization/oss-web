import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import { Loading, useApi } from '../api/Hooks';
import { IPlaylist, IList } from '../api/Models';
import '../style/general.scss';
import Cell from './Cell';


function Playlist() {

    const [playlists] = useApi<IList<IPlaylist>>('playlist');
    if (!playlists) return <Loading />

    return (
        <Cell area='playlists'>
            <Jumbotron fluid className="Playlist">
                <Container>
                    <ul>
                        {playlists.objects.map(list =>
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

