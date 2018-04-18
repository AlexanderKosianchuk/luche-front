import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, I18n } from 'react-redux-i18n';

import FlightFilterItem from 'components/flight-statistics/flight-filter-item/FlightFilterItem';

import request from 'actions/request';
import transmit from 'actions/transmit';

class FlightFilter extends Component {
  constructor(props) {
    super(props);

    const fields = [
      ['fdr-type', 'flight-filter-fdr-type', I18n.t('flightStatistics.flightFilter.fdrType'), ''],
      ['bort', 'flight-filter-bort',  I18n.t('flightStatistics.flightFilter.bort'), ''],
      ['flight', 'flight-filter-flight',  I18n.t('flightStatistics.flightFilter.voyage'), ''],
      ['departure-airport', 'flight-filter-departure-airport',  I18n.t('flightStatistics.flightFilter.departureAirport'), 'DDDD'],
      ['arrival-airport', 'flight-filter-arrival-airport',  I18n.t('flightStatistics.flightFilter.arrivalAirport'), 'AAAA'],
      ['from-date', 'flight-filter-from-date',  I18n.t('flightStatistics.flightFilter.departureFromDate'), 'YYYY/mm/dd'],
      ['to-date', 'flight-filter-to-date',  I18n.t('flightStatistics.flightFilter.departureToDate'), 'YYYY/mm/dd']
    ];

    this.flightFilterItems = fields.map((field) =>
      <FlightFilterItem
        key={field[1]}
        propName={field[0]}
        id={field[1]}
        label={field[2]}
        placeholder={field[3]}
        changeFlightFilterItem={ this.changeFlightFilterItem.bind(this) }
      />
    );
  }

  changeFlightFilterItem(payload) {
    this.props.transmit(
      'CHANGE_FLIGHT_FILTER_ITEM',
      payload
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.request(
      ['flightStatistics', 'getParams'],
      'post',
      'FLIGHT_STATISTICS_PARAMS',
      { flightFilter: this.props.flightFilter }
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p><b><Translate value='flightStatistics.flightFilter.flightInfoFilter'/></b></p>
        { this.flightFilterItems }
        <div className='form-group'>
          <input type='submit' className='btn btn-default' value={ I18n.t('flightStatistics.flightFilter.apply') }/>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    flightFilter: state.flightFilter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightFilter);
