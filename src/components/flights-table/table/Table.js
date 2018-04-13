import 'react-table/react-table.css'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n } from 'react-redux-i18n';

import TableControl from 'controls/table/Table';
import ContentLoader from 'controls/content-loader/ContentLoader';

import request from 'actions/request';
import transmit from 'actions/transmit';

const TOP_CONTROLS_HEIGHT = 105;

class Table extends Component {
  constructor(props) {
    super(props);

    this.columns = [{
      Header: I18n.t('flightsTable.table.bort'),
      accessor: 'bort'
    }, {
      Header: I18n.t('flightsTable.table.voyage'),
      accessor: 'voyage',
    }, {
      Header: I18n.t('flightsTable.table.performer'),
      accessor: 'performer',
    }, {
      Header: I18n.t('flightsTable.table.startCopyTime'),
      accessor: 'startCopyTimeFormated'
    }, {
      Header: I18n.t('flightsTable.table.departureAirport'),
      accessor: 'departureAirport'
    }, {
      Header: I18n.t('flightsTable.table.arrivalAirport'),
      accessor: 'arrivalAirport'
    }];
  }

  componentDidMount() {
    this.resize();

    if (this.props.pending !== false) {
      this.props.request(
        ['flights', 'getAll'],
        'get',
        'FLIGHTS'
      );
    }
  }

  componentDidUpdate() {
    this.resize();
  }

  resize() {
    this.container.style.height = window.innerHeight - TOP_CONTROLS_HEIGHT + 'px';
  }

  handleGetTrProps(state, rowInfo, column, instance) {
    return {
      className: (() => {
        if (!rowInfo || !this.props.flights.chosenItems) {
          return '';
        }

        let isChosen = this.props.flights.chosenItems.some((element) => {
          return element.id === rowInfo.original.id
        });

        return isChosen ? 'is-chosen' : '';
      })(),
      onClick: event => {
        let target = event.currentTarget;
        target.classList.toggle('is-chosen');

        this.props.transmit(
          'FLIGHTS_CHOISE_TOGGLE',
          {
            id: rowInfo.original.id,
            checkstate: target.classList.contains('is-chosen')
          }
        );
      }
    }
  }

  buildTable() {
    //copying array
    var data = this.props.flights.items.slice();

    return (<TableControl
      data={ data }
      columns={ this.columns }
      getTrProps={ this.handleGetTrProps.bind(this) }
    />);
  }

  buildBody() {
    if (this.props.flights.pending !== false) {
      return <ContentLoader/>
    } else {
      return this.buildTable();
    }
  }

  render() {
    return (
      <div className='flights-table-table'
        ref={(container) => { this.container = container; }}
      >
        { this.buildBody() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    flights: state.flights,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
