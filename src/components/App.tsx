import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import '../style/general.scss';
import ActiveSong from './ActiveSong';
import Artists from './Artists';
import Cell from './Cell';
import Nav from './NavBar';
import Player from './Player';
import PlaylistsBar from './PlaylistsBar';
import { useApi } from '../api/Hooks';
import { IActiveTrack } from '../api/Models';
import Playlists from './Playlists';
import classes from 'classnames';
import Albums from './Albums';
import Tracks from './Tracks';
import Dialog, { Provider as DialogProvider, DialogProps } from './Dialog';

function App() {

	const [activeTrack] = useApi<IActiveTrack>('active-track');
	const dialog = useState<DialogProps | null>(null);

	const pages: IPage[] = [
		{ path: '/tracks', component: Tracks },
		{ path: '/playlists/:id?', component: Playlists },
		{ path: '/artists', component: Artists },
		{ path: '/albums', component: Albums },
		{ path: '/tracks', component: Tracks },
	];

	return (
		<DialogProvider value={dialog}>

			<Router>
				<Nav />
				<Player track={activeTrack} />
				{activeTrack && <ActiveSong track={activeTrack} />}
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
