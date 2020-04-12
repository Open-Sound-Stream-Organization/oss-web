import React from 'react';
import '../style/general.scss';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import classes from 'classnames';

function Nav() {
    const path = useLocation().pathname;

    const links = [
        { href: '/playlists', text: 'Playlists' },
        { href: '/albums', text: 'Albums' },
        { href: '/artists', text: 'Artists' },
    ]

    return (
        <nav>
            <ul>
                {links.map(({ text, href }) =>
                    <li key={href} className={classes({ active: path === href })}>
                        <Link to={href}>{text}</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
