import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import '../style/general.scss';
import ActiveSong from './ActiveSong';
import Artists from './Artists';
import Cell from './Cell';
import Nav from './NavBar';
import Player from './Player';
import PlaylistsBar from './PlaylistsBar';
import { useApi } from '../api/Hooks';
import { IList, ISong } from '../api/Models';
import Playlists from './Playlists';
import classes from 'classnames';
import Albums from './Albums';
import Songs from './Songs';
import Dialog, { Provider as DialogProvider, DialogProps } from './Dialog';
import Seeder from './Seeder';
import Login from './Login';
import { useCreateAudio, Provider as AudioProvider } from '../api/Audio';

export const NO_COVER = require('../img/example-cover.jpg');

function App() {

	const dialog = useState<DialogProps | null>(null);
	const audio = useCreateAudio();

	const pages: IPage[] = [
		{ path: '/songs', component: Songs },
		{ path: '/playlists/:id?', component: Playlists },
		{ path: '/artists/:id?', component: Artists },
		{ path: '/albums/:id?', component: Albums },
		{ path: '/songs', component: Songs },
		{ path: '/seed', component: Seeder },
		{ path: '/login', component: Login },
	];

	return (
		<DialogProvider value={dialog}>
			<AudioProvider value={audio}>

				<Router>
					<Nav />
					<Player />
					<ActiveSong />
					<PlaylistsBar />

					<Dialog dialog={dialog[0]} />

					<Switch>

						{pages.map(page =>
							<Route key={page.path} path={page.path}>
								<Page {...page} />
							</Route >
						)}

						<Route exact path='/'>
							<Redirect to='/playlists' />
						</Route>

					</Switch>
				</Router>

			</AudioProvider>
		</DialogProvider>
	);
}

export interface IPage {
	path: string;
	component: () => JSX.Element | null;
	key?: string;
	text?: string;
}

function Page(page: IPage) {

	const path = useLocation().pathname.slice(1) + '/';
	const key = page.key ?? path.slice(0, path.indexOf('/'));

	useEffect(() => {
		document.title = 'OSS - ' + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
	}, [key]);

	return (
		<Cell area='page' id={key}>
			<page.component />
		</Cell>
	);
}

export default App;
