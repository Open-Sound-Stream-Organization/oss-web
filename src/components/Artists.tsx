import React from 'react';
import '../style/general.scss';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import classes from 'classnames';
import Jumbotron from 'react-bootstrap/Jumbotron';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { linkSync } from 'fs';
import img from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { useApi, Loading } from '../api/Hooks';
import { IArtist, IAlbum } from '../api/Models';

function Artists() {

    const [artists] = useApi<IArtist[]>('artist');
    const [albums] = useApi<IAlbum[]>('album');

    if (!artists || !albums) return <Loading />

    function handleClick() {
        console.log('funktioniert');
    }

    return (
        <>
            <Container className="ArtistsContainer">
                {artists.map(artist =>
                    <ListGroup className="ListGroupArtists">
                        <ListGroup.Item onClick={handleClick}>{artist.name}</ListGroup.Item>
                    </ListGroup>
                )}
            </Container>

            <Container className="EachArtist">
                {artists.map(artist =>
                    albums.map(album =>
                        <ListGroup className="ListGroupForEachArtist">
                            <Media>
                                <img
                                    width={64}
                                    height={64}
                                    className="mr-3"
                                    src={album.cover_url}
                                    alt="Cover"
                                />
                            </Media>
                            <p>{album.name}</p>
                            {/* Genre not yet avaiable <p>{album.genre} - </p> */}
                            <p>{album.release}</p>
                            <Row>
                                <ListGroup.Item onClick={handleClick}>{artist.name}</ListGroup.Item>
                            </Row>
                        </ListGroup>
                    )
                )}
            </Container>
        </>
    );
}

export default Artists;