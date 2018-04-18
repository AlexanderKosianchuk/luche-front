import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, I18n } from 'react-redux-i18n';

import ParamsFilterItem from 'components/flight-statistics/params-filter-item/ParamsFilterItem';
import ContentLoader from 'controls/content-loader/ContentLoader';

import transmit from 'actions/transmit';
import request from 'actions/request';

class ParamsFilter extends Component {
  handleSubmit(event) {
    event.preventDefault();

    let flightStatistics  = this.props.flightStatistics;
    let flightFilter = this.props.flightFilter;

    if (flightStatistics
      && !this.allEmpty(this.props.flightFilter)
      && Array.isArray(flightStatistics.chosenParams)
      && (flightStatistics.chosenParams.length > 0)
    ) {
      let chosenParams = flightStatistics.chosenParams.map((item) => item.id);
      this.props.request(
        ['flightStatistics', 'getValues'],
        'post',
        'FLIGHT_STATISTICS_VALUES',
        {
          chosenParams: chosenParams,
          flightFilter: flightFilter
        }
      );
    }
  }

  buildParams(params) {
    return params.map((param) => {
      let label = I18n.t('flightStatistics.paramsFilter.' + param.text);

      return (
        <ParamsFilterItem
          key={ param.id }
          id={ param.id }
          label={ label }
          changeCheckstate={ this.changeCheckstate.bind(this) }
        />
      );
    });
  }

  changeCheckstate (payload) {
    this.props.transmit(
      'CHANGE_FLIGHT_STATISTICS_PARAM_ITEM_CHECKSTATE',
      payload
    );
  }

  allEmpty (obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != "")
        return false;
    }
    return true;
  }

  render() {
    let body = I18n.t('flightStatistics.paramsFilter.putFlightFilter');
    let button ='';
    let flightStatistics  = this.props.flightStatistics;

    if (!this.allEmpty(this.props.flightFilter)
      && flightStatistics
      && (flightStatistics.pending === false)
    ) {
      body = I18n.t('flightStatistics.paramsFilter.noMonitoredParamsOnSpecifyedFilter');
    }

    if (flightStatistics && flightStatistics.pending) {
      body = <ContentLoader margin={ 5 } size={ 75 } />;
    }

    if (flightStatistics
      && (flightStatistics.pending === false)
      && Array.isArray(flightStatistics.avaliableParams)
      && (flightStatistics.avaliableParams.length > 0)
    ) {
      body = this.buildParams(flightStatistics.avaliableParams);
      button = <div className="form-group">
        <input type="submit" className="btn btn-default" value={ I18n.t('flightStatistics.paramsFilter.apply') } />
      </div>;
    }

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p><b><Translate value='flightStatistics.paramsFilter.monitoredParameters' /></b></p>
        { body }
        { button }
      </form>
    );
  }
}

function mapStateToProps(store) {
  return {
    flightStatistics: store.flightStatistics,
    flightFilter: store.flightFilter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch),
    request: bindActionCreators(request, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParamsFilter);
