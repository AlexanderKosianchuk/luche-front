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

let browserLang = (navigator.language || navigator.userLanguage).substring(0, 2);
if (Object.keys(translationsObject).indexOf(browserLang) !== -1) {
  store.dispatch(setLocale(browserLang.toLowerCase()));
} else {
  store.dispatch(setLocale('en'));
}

ReactDOM.render(
  <App store={ store } history={ history } />,
  document.getElementById('root')
);
