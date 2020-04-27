import React, { useEffect, useState, ReactNode } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Provider as AudioProvider, useCreateAudio } from '../api/Audio';
import '../style/general.scss';
import ActiveSong from './ActiveSong';
import Albums from './Albums';
import Artists from './Artists';
import Cell from './Cell';
import Dialog, { DialogProps, Provider as DialogProvider } from './Dialog';
import Nav from './NavBar';
import Player from './Player';
import Playlists from './Playlists';
import PlaylistsBar from './PlaylistsBar';
import Upload, { SongEditor } from './Upload';
import Seeder from './Seeder';
import Songs from './Songs';
import Api from '../api/Api';
import Login from './Login';
import { Loading } from '../api/Hooks';

export const NO_COVER = require('../img/example-cover.jpg');

function SinglePage({ children }: { children: ReactNode }) {
	return <section className='single'>{children}</section>;
}

function Logout() {
	useEffect(() => {
		Api.logout();
	});
	return <Redirect to='' />
}

function App() {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		Api.isLoginIn().then(b => setLoggedIn(b));
	})

	const dialog = useState<JSX.Element | null>(null);
	const audio = useCreateAudio();

	const pages: IPage[] = [
		{ path: '/playlists/:id?', component: Playlists },
		{ path: '/artists/:id?', component: Artists },
		{ path: '/albums/:id?', component: Albums },
		{ path: '/songs/edit/:id', component: SongEditor, id: 'edit' },
		{ path: '/songs', component: Songs },
		{ path: '/seed', component: Seeder },
		{ path: '/upload', component: Upload },
	];

	return (
		<DialogProvider value={dialog}>
			<AudioProvider value={audio}>
				<Router>

					{loggedIn
						? <section className='container'>
							<Nav />
							<Player />
							<ActiveSong />
							<PlaylistsBar />

							<Dialog>
								{dialog[0]}
							</Dialog>

							<Switch>

								{pages.map(page =>
									<Route key={page.path} path={page.path}>
										<Page {...page} />
									</Route >
								)}

								<Route exact path='/'>
									<Redirect to='/playlists' />
								</Route>

								<Route path='/logout'>
									<Logout />
								</Route>

								<Route>
									<Cell area='page'>
										<h1 className='empty-info'>404 - Not Found</h1>
									</Cell>
								</Route>

							</Switch>
						</section>

						: <SinglePage>
							{loggedIn === false
								? <Login />
								: <Loading />
							}
						</SinglePage>
					}

				</Router>

			</AudioProvider>
		</DialogProvider>
	);
}

export interface IPage {
	path: string;
	component: () => JSX.Element | null;
	id?: string;
	text?: string;
}

function Page(page: IPage) {

	const path = useLocation().pathname.slice(1) + '/';
	const id = page.id ?? path.slice(0, path.indexOf('/'));

	useEffect(() => {
		document.title = 'OSS - ' + id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
	}, [id]);

	return (
		<Cell area='page' id={id}>
			<page.component />
		</Cell>
	);
}

export default App;
