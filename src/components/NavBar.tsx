import { faCompactDisc, faList, faMusic, faUser } from '@fortawesome/free-solid-svg-icons';
import classes from 'classnames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/general.scss';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

function Nav() {
    const path = useLocation().pathname;

    const links = [
        { href: '/playlists', text: 'Playlists', icon: faList },
        { href: '/albums', text: 'Albums', icon: faCompactDisc },
        { href: '/artists', text: 'Artists', icon: faUser },
        { href: '/tracks', text: 'Tracks', icon: faMusic },
        {href: '/login', text: 'Login', icon: faUser}
    ]

    return (
        <nav>
            <ul>
                {links.map(({ text, href, icon }) =>
                    <li key={href} className={classes({ active: path === href })}>
                        <Link to={href}>
                            <span>{text}</span>
                            <Icon {...{ icon }} />
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
