import './top-menu.sass';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLocale, Translate, I18n } from 'react-redux-i18n';

import NavbarToggle from 'controls/navbar-toggle/NavbarToggle';
import FlightUploaderDropdown from 'controls/top-menu/flight-uploader-dropdown/FlightUploaderDropdown';
import FlightImporterDropdown from 'controls/top-menu/flight-importer-dropdown/FlightImporterDropdown';
import FlightUploadingProgressIndicator from 'controls/top-menu/flight-uploading-progress-indicator/FlightUploadingProgressIndicator';

import redirect from 'actions/redirect';
import request from 'actions/request';
import transmit from 'actions/transmit';

class TopMenu extends React.Component {
  changeLanguage(event) {
    let language = event.target.getAttribute('data-lang').toLowerCase();
    this.props.request(
      ['users', 'changeLanguage'],
      'post',
      'USER_CHANGE_LANGUAGE',
      { lang: language }
    ).then(() => {
      this.props.transmit(null, setLocale(language),  true);
    });
  }

  buildLanguageMenu() {
    return Object.keys(this.props.avaliableLanguages).map(item => {
      item = item.toUpperCase();
      if ((item.length === 2) // language only 2 symbol length
        && (item !== this.props.userLang.toUpperCase())
      ) {
        return <li key={ item }><a href='#' onClick={ this.changeLanguage.bind(this) } data-lang={ item }>{ item }</a></li>
      }
    });
  }

  logout() {
    this.props.request(
      ['users', 'logout'],
      'post',
      'USER_LOGOUT'
    ).then(() => this.props.redirect('/login'));
  }

  render() {
    this.languageMenu = this.buildLanguageMenu();
    return (
      <nav className='top-menu navbar navbar-dark'>
        <div className='container-fluid'>
        <div className='navbar-header'>
          <NavbarToggle
            target='#top-menu-navbar-collapse'
            styleClass='navbar-toggle__white'
          />
          <a className='main-menu-toggle navbar-brand is-hoverable' href='#'>
            <span className='main-menu-toggle top-menu__main-menu-toggle glyphicon glyphicon-menu-hamburger'></span>
          </a>
          <a className='top-menu__navbar-brand navbar-brand' href='#' onClick={ () => { this.props.redirect('/') }}>
            <Translate value={ 'topMenu.brand' } />
          </a>
        </div>
        <div className='collapse navbar-collapse' id='top-menu-navbar-collapse'>
          <ul className='nav navbar-nav'>
          <li className='dropdown'>
            <a href='#'
            className='realtime-calibration dropdown-toggle is-hoverable'
            role='button'
            onClick={ () => { this.props.redirect('/realtime-calibration') }}
            >
            { I18n.t('topMenu.calibrate') }
            </a>
          </li>
          </ul>

          <ul className='nav navbar-nav'>
          <li className='dropdown'>
            <a href='#' className='flight-importer-dropdown-toggle dropdown-toggle is-hoverable' role='button'>
            { I18n.t('topMenu.fileImport') }
            </a>
            <FlightImporterDropdown/>
          </li>
          </ul>

          <ul className='nav navbar-nav'>
          <li className='dropdown'>
            <a href='#' className='flight-uploader-dropdown-toggle dropdown-toggle is-hoverable' role='button'>
            { I18n.t('topMenu.upload') }
            </a>
            <FlightUploaderDropdown/>
          </li>
          </ul>

          <ul className='nav navbar-nav'>
            <FlightUploadingProgressIndicator />
          </ul>

          <ul className='nav navbar-nav navbar-right'>
          <li><span>{ this.props.userLogin }</span></li>
          <li className='dropdown'>
            <a href='#' className='dropdown-toggle is-hoverable' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
            { this.props.userLang.toUpperCase() }
           </a>
            <ul className='top-menu__dropdown-menu top-menu__language-menu dropdown-menu'>
            { this.languageMenu }
            </ul>
          </li>
          <li><a className='is-hoverable' onClick={ () => { this.props.redirect('/user-settings') }} href='#'>
            <span className='glyphicon glyphicon-cog'></span>
          </a></li>
          <li><a className='is-hoverable' onClick={ this.logout.bind(this) } href='#'>
            <span className='glyphicon glyphicon-log-out'></span>
          </a></li>
          </ul>
        </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLogin: state.user.login,
    userLang: state.user.lang,
    avaliableLanguages: state.i18n.translations
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch),
    redirect: bindActionCreators(redirect, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
