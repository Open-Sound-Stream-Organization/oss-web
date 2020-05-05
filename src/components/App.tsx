import React, { ReactNode, useEffect, useState, Provider, ExoticComponent, MemoExoticComponent } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Api from '../api/Api';
import { Provider as AudioProvider, useCreateAudio } from '../api/Audio';
import { Loading } from '../api/Hooks';
import '../style/general.scss';
import ActiveSong from './ActiveSong';
import Albums from './Albums';
import Artists from './Artists';
import Cell from './Cell';
import Dialog, { Provider as DialogProvider } from './Dialog';
import Messages, { Provider as MessageProvider, IMessage } from './Message';
import Login from './Login';
import Nav from './NavBar';
import Player from './Player';
import Playlists from './Playlists';
import PlaylistsBar from './PlaylistsBar';
import Seeder from './Seeder';
import Songs from './Songs';
import Upload, { SongEditor } from './Upload';

export const NO_COVER = require('../img/example-cover.jpg');

const SinglePage = ({ children }: { children: ReactNode }) => {
	return <section className='single'>{children}</section>;
}

const Logout = () => {
	useEffect(() => {
		Api.logout();
	});
	return <Redirect to='' />
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		Api.isLoggedIn().then(b => setLoggedIn(b));
	}, []);

	const dialog = useState<JSX.Element | null>(null);
	const audio = useCreateAudio();
	const messages = useState<IMessage[]>([]);

	const pages: IPage[] = [
		{ path: '/playlists/:id?', component: Playlists },
		{ path: '/artists/:id?', component: Artists },
		{ path: '/albums/:id?', component: Albums },
		{ path: '/songs', component: Songs },
		{ path: '/seed', component: Seeder },
		{ path: '/upload', component: Upload },
	];

	return (
		<DialogProvider value={dialog}>
			<AudioProvider value={audio}>
				<MessageProvider value={messages}>
					<Router>

						{loggedIn
							? <section className='container'>
								<Nav />
								<Player />
								<ActiveSong />
								<PlaylistsBar />

								<Dialog />
								<Messages />

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

				</MessageProvider>
			</AudioProvider>
		</DialogProvider>
	);
}

export interface IPage {
	path: string;
	component: (() => JSX.Element | null) | MemoExoticComponent<() => JSX.Element | null>;
	id?: string;
	text?: string;
}

const Page = (page: IPage) => {

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
