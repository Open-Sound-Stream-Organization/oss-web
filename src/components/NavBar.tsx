import { faCompactDisc, faList, faMusic, faUser, faSeedling, faDoorOpen, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import classes from 'classnames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation bar
 */
const Nav = () => {
    const path = useLocation().pathname;

    const links = [
        { href: '/songs', text: 'Songs', icon: faMusic },
        { href: '/playlists', text: 'Playlists', icon: faList },
        { href: '/albums', text: 'Albums', icon: faCompactDisc },
        { href: '/artists', text: 'Artists', icon: faUser },
        { href: '/upload', text: 'Upload', icon: faUpload },
        { href: '/logout', text: 'Logout', icon: faDoorOpen },
    ];

    return (
        <nav>
            <ul>
                {links.map(({ text, href, icon }) =>
                    <Link key={href} to={href}>
                        <li className={classes({ active: path === href })}>
                            <span>{text}</span>
                            <Icon {...{ icon }} />
                        </li>
                    </Link>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
