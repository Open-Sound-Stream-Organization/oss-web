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


function Playlist() {
    const path = useLocation().pathname;
    const testplaylist = [
        { id: 1, name: "list1" },
        { id: 2, name: "list2" },
        { id: 3, name: "list3" },
        { id: 4, name: "list4" },
        { id: 5, name: "list5" },
        { id: 6, name: "list6" },
        { id: 7, name: "list7" },
        { id: 8, name: "list8" },
    ];

    return (
        <Jumbotron fluid className= "Playlist">
            <Container>
                <ul>
                    {testplaylist.map((list) => 

                        <ListGroup className= "ListGroup" variant="flush">
                            <ListGroup.Item action href= "info">{list.name}</ListGroup.Item>
                            {/* <ListGroup.Item action variant = "info"></ListGroup.Item>
                            <ListGroup.Item action variant = "info">playlist2</ListGroup.Item> */}

                        </ListGroup>
                    )}
                </ul>
            </Container>
        </Jumbotron>

    );
}

export default Playlist;

