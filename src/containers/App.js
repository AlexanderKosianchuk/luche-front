import React, { Component } from 'react';
import { hot } from 'react-hot-loader'

import Root from 'containers/Root';

const App = (props) => <Root store={ props.store } history={ props.history } />

export default hot(module)(App);
