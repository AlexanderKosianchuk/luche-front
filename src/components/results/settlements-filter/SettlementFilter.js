import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, I18n } from 'react-redux-i18n';

import SettlementsFilterItem from 'components/results/settlements-filter-item/SettlementsFilterItem';
import ContentLoader from 'controls/content-loader/ContentLoader';

import transmit from 'actions/transmit';
import request from 'actions/request';

class SettlementFilter extends React.Component {
  handleSubmit(event) {
    let settlementFilter  = this.props.settlementFilter;
    let flightFilter = this.props.flightFilter;

    if (settlementFilter
      && !this.allEmpty(this.props.flightFilter)
      && Array.isArray(settlementFilter.chosenSettlements)
      && (settlementFilter.chosenSettlements.length > 0)
    ) {
      let chosenSettlements = settlementFilter.chosenSettlements.map((item) => item.id);
      this.props.request(
        ['results', 'getReport'],
        'get',
        'SETTLEMENTS_REPORT',
        {
          chosenSettlements: JSON.stringify(chosenSettlements),
          flightFilter: JSON.stringify(flightFilter)
        }
      );
    }
    event.preventDefault();
  }

  buildSettlements(settlements) {
    return settlements.map((settlement) => {
      let label = I18n.t('results.settlementFilter.' + settlement.text);

      return (
        <SettlementsFilterItem
          key={ settlement.id }
          id={ settlement.id }
          label={ label }
          changeCheckstate={ this.changeCheckstate.bind(this) }
        />
      );
    });
  }

  changeCheckstate (payload) {
    this.props.transmit(
      'CHANGE_SETTLEMENT_ITEM_CHECKSTATE',
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
    let body = I18n.t('results.settlementFilter.putFlightFilter');
    let button ='';
    let settlementFilter  = this.props.settlementFilter;

    if (!this.allEmpty(this.props.flightFilter)
      && settlementFilter
      && (settlementFilter.pending === false)
    ) {
      body = I18n.t('results.settlementFilter.noMonitoredParamsOnSpecifyedFilter');
    }

    if (settlementFilter && settlementFilter.pending) {
      body = <ContentLoader margin={ 5 } size={ 75 } />;
    }

    if (settlementFilter
      && (settlementFilter.pending === false)
      && Array.isArray(settlementFilter.avaliableSettlements)
      && (settlementFilter.avaliableSettlements.length > 0)
    ) {
      body = this.buildSettlements(settlementFilter.avaliableSettlements);
      button = <div className="form-group">
        <input type="submit" className="btn btn-default" value={ I18n.t('result.settlementFilter.apply') } />
      </div>;
    }

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p><b><Translate value='results.settlementFilter.monitoredParameters' /></b></p>
        { body }
        { button }
      </form>
    );
  }
}

function mapStateToProps(store) {
  return {
    settlementFilter: store.settlementFilter,
    flightFilter: store.flightFilter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeCheckstate: bindActionCreators(transmit, dispatch),
    request: bindActionCreators(request, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettlementFilter);
