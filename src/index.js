import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import ErrorBoundary from './ErrorBoundary';
import { setConnection } from './signalingClient';
import registerServiceWorker from './registerServiceWorker';

const Home = lazy(() => import('./containers/Home'));
const Broadcast = lazy(() => import('./containers/Broadcast'));

setConnection();

const App = () => (
    <React.Fragment>
        <CssBaseline />
        <ErrorBoundary>
            <BrowserRouter>
                <Suspense fallback="Loading...">
                    <Switch>
                        <Route path="/" exact render={props => <Home {...props} />} />
                        <Route path="/stream/:broadcastId?" exact component={props => <Broadcast {...props} />} />
                        <Redirect to="/" />
                    </Switch>
                </Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    </React.Fragment>
);

render(<App />, document.getElementById('root'));
registerServiceWorker();
