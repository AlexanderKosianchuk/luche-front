/*jslint browser: true*/

'use strict';

import './assets/favicone.ico';
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

const html = document.getElementsByTagName('HTML')[0];
const login = html.getAttribute('login');
const role = html.getAttribute('role');
const lang = html.getAttribute('lang');

if (login && role && lang) {
  store.dispatch({
    type: 'USER_LOGGED_IN',
    payload: {
      login: login,
      role: role,
      lang: lang
    }
  });

  store.dispatch(setLocale(lang.toLowerCase()));
} else {
  store.dispatch(setLocale('ru'));
}

ReactDOM.render(
  <App store={ store } history={ history } />,
  document.getElementById('root')
);
