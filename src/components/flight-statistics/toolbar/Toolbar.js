import './toolbar.sass';

import React, { Component } from 'react';
import { Translate } from 'react-redux-i18n';

export default class Toolbar extends Component {
  render() {
    return (
      <div className='flight-statistics-toolbar'>
        <h4><Translate value='flightStatistics.toolbar.aggregatedStatistics'/></h4>
      </div>
    );
  }
}
