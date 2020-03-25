import React from 'react';
import '../style/general.scss';
import Nav from './NavBar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Nav />

			<Switch>

				<Route path='/saved'>
					<h1>Saved</h1>
				</Route>

				<Route path='/settings'>
					<h1>Settings</h1>
				</Route>

				<Route exact path='/'>
					<h1>Home</h1>
				</Route>

			</Switch>
		</Router>
	);
}

export default App;
