import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Form from 'components/login/form/Form';

import redirect from 'actions/redirect';

class Login extends Component {
  componentWillMount() {
    if (this.props.login !== null) {
      this.props.redirect('/');
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.login !== null) {
      this.props.redirect('/');
    }
  }

  render() {
    return <Form/>;
  }
}

function mapStateToProps(state) {
  return {
    login: state.user.login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    redirect: bindActionCreators(redirect, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
