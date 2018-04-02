import 'assets/images/logo-bg.png';
import './form.sass';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLocale, Translate } from 'react-redux-i18n';

import request from 'actions/request';
import transmit from 'actions/transmit';
import redirect from 'actions/redirect';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  auth(event) {
    event.preventDefault();

    this.props.request(
      ['users', 'login'],
      'post',
      'USER_LOGIN', {
        login: this.loginInput.value,
        pass: this.passInput.value
      }
    ).then((response) => {
      this.props.transmit(null, setLocale(response.lang.toLowerCase()),  true);
      this.props.redirect('/');
    }, (response) => {
      this.props.transmit('LOGIN_FAILED', response);

      this.setState({
        message: response.message
      });
    });
  }

  render() {
    return (
      <form className='login-form' onSubmit={ this.auth.bind(this) }>
        <div className='login-form__form-wrapper'>
          <div>
            <div className='login-form__header'>
              <Translate value='login.form.welcome'/>
            </div>
            <div className='login-form__header-small'>
              <Translate value='login.form.to'/>
            </div>
            <div className='login-form__header-small'>
              <Translate value='login.form.vendor'/>
            </div>
          </div>

          <div className={ 'login-form__message-row ' + ((this.state.message === '') ? 'is-hidden' : '') }>
              <Translate value={ 'login.form.' + this.state.message }/>
          </div>

          <div className='login-form__row'>
            <div className='login-form__input-wrap'>
              <Translate value='login.form.userName'/>
              <input name='login' ref={ (textInput) => { this.loginInput = textInput; }}
                className='form-control login-form__form-control' type='text'
              />
            </div>
          </div>

          <div className='login-form__row'>
            <div className='login-form__input-wrap'>
              <Translate value='login.form.password'/>
              <input name='pass' ref={ (textInput) => { this.passInput = textInput; }}
                className='form-control login-form__form-control' type='password'
              />
            </div>
          </div>

          <div className='row login-form__row'>
            <button onClick={ this.auth.bind(this) } className='btn btn-default login__btn' >
              <Translate value='login.form.authorize'/>
            </button>
          </div>
        </div>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch),
    redirect: bindActionCreators(redirect, dispatch)
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(Form);
