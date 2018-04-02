import './root.sass';

import React, { Component } from 'react';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';

import Router from 'containers/Router';
import SplashScreen from 'containers/splash-screen/SplashScreen';

import bindSocket from 'actions/bindSocket';
import request from 'actions/request';
import transmit from 'actions/transmit';
import redirect from 'actions/redirect';

class Root extends Component {
  componentWillMount() {
    if (this.props.userPending !== false) {
      this.props.request(
        ['users', 'get'],
        'get',
        'USER',
      ).then((resp) => {
        if (resp.login === null) {
          this.props.redirect('/login');
        } else {
          this.props.transmit(null, setLocale(resp.lang.toLowerCase()),  true);
        }
      });
    }
  }

  componentDidMount() {
    this.props.bindSocket({ interactionUrl: INTERACTION_URL });
  }

  render() {
    if (this.props.userPending !== false) {
      return <SplashScreen/>;
    }

    return (
      <AppContainer>
        <Provider store={ this.props.store }>
          <Router history={ this.props.history } />
        </Provider>
      </AppContainer>
    );
  }
};

function mapStateToProps(state) {
  return {
    userPending: state.user.pending
  };
}

function mapDispatchToProps(dispatch) {
  return {
    bindSocket: bindActionCreators(bindSocket, dispatch),
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch),
    redirect: bindActionCreators(redirect, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
