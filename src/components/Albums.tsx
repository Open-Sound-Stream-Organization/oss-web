import React from 'react';
import '../style/general.scss';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import classes from 'classnames';
import Jumbotron from 'react-bootstrap/Jumbotron';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { linkSync } from 'fs';
import Media from 'react-bootstrap/Media';
import img from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const album = [
    { id: 1, name: "album1", artist: "artist", genre: "pop", year: "1999" },
    { id: 2, name: "album2", artist: "artist", genre: "pop", year: "1999" },
    { id: 3, name: "album3", artist: "artist", genre: "pop", year: "1999" },
    { id: 4, name: "album4", artist: "artist", genre: "pop", year: "1999" },
    { id: 5, name: "album5", artist: "artist", genre: "pop", year: "1999" },
    { id: 6, name: "album6", artist: "artist", genre: "pop", year: "1999" },
    { id: 7, name: "album7", artist: "artist", genre: "pop", year: "1999" },
    { id: 8, name: "album8", artist: "artist", genre: "pop", year: "1999" },
];

const tracks = [
    { id: 1, name: "album1", artist: "artist", genre: "pop", year: "1999" },
    { id: 2, name: "album2", artist: "artist", genre: "pop", year: "1999" },
    { id: 3, name: "album3", artist: "artist", genre: "pop", year: "1999" },
    { id: 4, name: "album4", artist: "artist", genre: "pop", year: "1999" },
    { id: 5, name: "album5", artist: "artist", genre: "pop", year: "1999" },
    { id: 6, name: "album6", artist: "artist", genre: "pop", year: "1999" },
    { id: 7, name: "album7", artist: "artist", genre: "pop", year: "1999" },
    { id: 8, name: "album8", artist: "artist", genre: "pop", year: "1999" },
];

function handleClick() {
    console.log("funktioniert_Albums");
}
function Albums() {
    return (
        <Container className="EachArtist">
            <Media>
                <img
                    width={64}
                    height={64}
                    className="mr-3"
                    src="holder.js/64x64"
                    alt="AlbumwhCover"
                />
            </Media>

            {album.map((album) =>
                <ListGroup className="ListGroupForEachArtist">
                    <p>{album.name}</p>
                    <p>{album.artist}</p>
                    <p>{album.genre} - </p>
                    <p>{album.year}</p>
                    {tracks.map((tracks) =>
                        <Row>
                            <ListGroup.Item onClick={handleClick}>{tracks.name}</ListGroup.Item>
                        </Row>)}
                </ListGroup>
            )}
        </Container>
    );
}

export default Albums;