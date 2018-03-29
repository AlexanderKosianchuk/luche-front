import './root.sass';

import React, { Component } from 'react';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Router from 'containers/Router';

import bindSocket from 'actions/bindSocket';

class Root extends Component {
  componentDidMount() {
    this.props.bindSocket({ interactionUrl: INTERACTION_URL });
  }

  render() {
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    bindSocket: bindActionCreators(bindSocket, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
