import React from 'react';
import '../style/general.scss';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import classes from 'classnames';

function Nav() {
    const path = useLocation().pathname;

    const links = [
        { href: '/', text: 'Home' },
        { href: '/saved', text: 'Saved' },
        { href: '/settings', text: 'Settings' },
    ]

    return (
        <nav>
            <ul>
                {links.map(({ text, href }) =>
                    <li className={classes({ active: path === href })}>
                        <Link to={href}>{text}</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
