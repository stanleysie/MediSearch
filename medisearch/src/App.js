/* REACT AND CSS */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useGeneralContext } from './utils/context'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { Dimmer, Loader } from 'semantic-ui-react'
import { NotificationContainer } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import routes from './utils/routes'

/* LIBRARIES */
import { APIKey } from './utils/API'

/* COMPONENTS */
import NavigationBar from './components/NavigationBar'

function App() {
	const { dispatch } = useGeneralContext();
	const [loading, setLoading] = useState(true);

	const initialization = () => {
		if(window.google === undefined) {
            var script = document.createElement('script');
            document.body.append(script);
            script.src = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=places,geometry`

            script.addEventListener('load', () => {
                let map = new window.google.maps.Map(document.getElementById('map'), {
                    center: { lat: 12.8797, lng: 121.7740 },
                    zoom: 6
                });

                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
						dispatch({
							type: 'setMap',
							value: {
								map,
								position: { lat: position.coords.latitude, lng: position.coords.longitude }
							}
						})
                    })
                }
            })
        } else {
			setLoading(false);
		}
	}
	
	useEffect(initialization, []);

	const pages = routes.map(route => {
		let Component = route.component;
		return (
			<Route
				key={route.key}
				exact={route.exact}
				path={route.path}
				render={() => (
					<Component updateLoading={setLoading} />
				)}
				{...routes} />
		)
	});
	return (
        <Router>
			<NotificationContainer />
			<NavigationBar />
			<Dimmer.Dimmable 
				className='dimmer-content'
				blurring={loading} 
				dimmed={loading}>
				<Switch>{pages}</Switch>
			</Dimmer.Dimmable>
			<Loader active={loading} content='Loading' />
			<div id='map' />
		</Router>
	);
}

export default App;
