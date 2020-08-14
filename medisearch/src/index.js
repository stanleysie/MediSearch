import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GeneralProvider } from './utils/context'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <GeneralProvider>
        <App />
    </GeneralProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/**
 *  npm install create-react-app -g // anywhere is fine
 *  npx create-react-app app-name
 */