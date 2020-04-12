import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '../style/general.scss';
import ActiveSong from './ActiveSong';
import Artists from './Artists';
import Cell from './Cell';
import Nav from './NavBar';
import Player from './Player';
import PlaylistsBar from './PlaylistsBar';
import { useApi } from '../api/Hooks';
import { IActiveTrack } from '../api/Models';

function App() {

	const [activeTrack] = useApi<IActiveTrack>('active-track');

	return (
		<Router>
			<Nav />
			<Player track={activeTrack} />
			{activeTrack && <ActiveSong track={activeTrack} />}
			<PlaylistsBar />

			<Switch>

				<Cell area='page'>
					<Route path='/playlists'>
						<h1>Playlists</h1>
					</Route>

					<Route path='/albums'>
						<h1>Albums</h1>
					</Route>

					<Route path='/artists'>
						<Artists />
					</Route>

					<Route exact path='/'>
						<Redirect to='/playlists' />
					</Route>

				</Cell>

			</Switch>
		</Router>

	);
}

export default App;
