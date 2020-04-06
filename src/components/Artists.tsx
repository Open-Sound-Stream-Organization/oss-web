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

function Artists() {
    const testartists = [
        { id: 1, name: "artist1" },
        { id: 2, name: "artist2" },
        { id: 3, name: "artist3" },
        { id: 4, name: "artist4" },
        { id: 5, name: "artist5" },
        { id: 6, name: "artist6" },
        { id: 7, name: "artist7" },
        { id: 8, name: "artist8" },
    ];
    const EachArtist = [
        { id: 1, name: "song1" },
        { id: 2, name: "song2" },
        { id: 3, name: "song3" },
        { id: 4, name: "song4" },
        { id: 5, name: "song5" },
        { id: 6, name: "song6" },
        { id: 7, name: "song7" },
        { id: 8, name: "song8" },
    ];
    const album = [
        { id: 1, name: "album1", genre: "pop", year: "1999" },
        { id: 2, name: "album2", genre: "pop", year: "1999" },
        { id: 3, name: "album3", genre: "pop", year: "1999" },
        { id: 4, name: "album4", genre: "pop", year: "1999" },
        { id: 5, name: "album5", genre: "pop", year: "1999" },
        { id: 6, name: "album6", genre: "pop", year: "1999" },
        { id: 7, name: "album7", genre: "pop", year: "1999" },
        { id: 8, name: "album8", genre: "pop", year: "1999" },
    ];

    function handleClick() {
        console.log('funktioniert');
    }
    return (
        <>
            <Container className="ArtistsContainer">
                {testartists.map((list) =>
                    <ListGroup className="ListGroupArtists">
                        <ListGroup.Item onClick={handleClick}>{list.name}</ListGroup.Item>
                    </ListGroup>
                )}
            </Container>
        
        <Container className="EachArtist">
            <Media>
                <img
                    width={64}
                    height={64}
                    className="mr-3"
                    src="holder.js/64x64"
                    alt="Cover"
                /> </Media>
            {EachArtist.map((list2) => {
                album.map((album) =>
                    <ListGroup className="ListGroupForEachArtist">
                        <p>{album.name}</p>
                        <p>{album.genre} - </p>
                        <p>{album.year}</p>
                        <Row>
                            <ListGroup.Item onClick={handleClick}>{list2.name}</ListGroup.Item>
                        </Row>
                    </ListGroup>
                )
            }
            )}
        </Container>
        </>
    );
}

export default Artists;