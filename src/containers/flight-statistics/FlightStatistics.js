import './flight-statistics.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from 'controls/menu/Menu';
import Toolbar from 'components/flight-statistics/toolbar/Toolbar';
import FlightFilter from 'components/flight-statistics/flight-filter/FlightFilter';
import ParamsFilter from 'components/flight-statistics/params-filter/ParamsFilter';
import Values from 'components/flight-statistics/values/Values';

export default class FlightStatistics extends Component {
  render() {
    return (
      <div>
        <Menu />
        <div className='flight-statistics container-fluid'>
          <div className='row'>
            <div className='col-sm-12'>
              <Toolbar/>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-3'>
              <FlightFilter/>
            </div>
            <div className='col-sm-3'>
              <ParamsFilter/>
            </div>
            <div className='col-sm-6'>
              <Values/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
