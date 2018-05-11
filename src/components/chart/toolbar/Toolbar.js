import './toolbar.sass'

import React, { Component } from 'react';

import FlightViewOptionsSwitch from 'controls/flight-view-options-switch/FlightViewOptionsSwitch';
import Print from 'components/chart/print/Print';
import FullSize from 'components/chart/full-size/FullSize';
import ParamsToggle from 'components/chart/params-toggle/ParamsToggle';
import ThreeDimToggle from 'components/chart/three-dim-toggle/ThreeDimToggle';
import Player from 'components/chart/player/Player';

import NavbarToggle from 'controls/navbar-toggle/NavbarToggle';

export default class Toolbar extends Component {
  render() {
    return (
      <nav className='flight-events-toolbar navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <NavbarToggle/>
          </div>

          <div className='collapse navbar-collapse' id='bs-navbar-collapse'>
            <FlightViewOptionsSwitch
              flightId={ this.props.flightId }
            />
            <Player
              flightId={ this.props.flightId }
            />
            <Print
              flightId={ this.props.flightId }
            />
            <FullSize/>
            <ParamsToggle/>
            <ThreeDimToggle
              threeDimIsShown={ this.props.threeDimIsShown }
              toggleThreeDimIsShown={ this.props.toggleThreeDimIsShown }
            />
          </div>
        </div>
      </nav>
    );
  }
}
