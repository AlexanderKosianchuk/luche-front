/*jslint browser: true*/

'use strict';

import './assets/favicone.ico';

//workaround cause url rewrite need
import '../.htaccess';

import 'jquery';
import facade from 'facade';

import React from 'react';
import ReactDOM from 'react-dom';

import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { setLocale, loadTranslations } from 'react-redux-i18n';

import App from 'containers/App'

import configureStore from 'store/configureStore';

import translationsEn from 'translations/translationsEn';
import translationsEs from 'translations/translationsEs';
import translationsRu from 'translations/translationsRu';

const history = createBrowserHistory({ queryKey: false });
const routerMiddlewareInstance = routerMiddleware(history);
const store = configureStore({}, routerMiddlewareInstance);
const translationsObject = {...translationsEn, ...translationsEs, ...translationsRu};

store.dispatch(loadTranslations(translationsObject));

facade(store);

store.dispatch(setLocale('ru'));

ReactDOM.render(
  <App store={ store } history={ history } />,
  document.getElementById('root')
);
