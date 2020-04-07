import React from 'react';
import '../style/general.scss';
import Nav from './NavBar'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Player from './Player';
import ActiveSong from './ActiveSong';
import Cell from './Cell';
import { IActiveTrack } from '../Models';
import PlaylistsBar from './PlaylistsBar';
import Artists from './Artists';

function App() {

	const activeTrack: IActiveTrack = {
		name: 'Song Name',
		artist: {
			name: 'Dieter Bohlen'
		},
		album: {
			name: 'Top 10 Nationalhymnen'
		},
		length: 168,
		position: 20,
	}

	return (
		<Router>
			<Nav />
			<Player {...activeTrack} />
			<ActiveSong {...activeTrack} />
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
