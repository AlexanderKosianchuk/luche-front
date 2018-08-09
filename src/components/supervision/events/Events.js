import './events.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';
import moment from 'moment';

import TileItem from 'components/supervision/tile-item/TileItem';

class RealtimeEvents extends Component {
  eventsExist() {
    if ((this.props.events.length === 0)
      || (this.props.events[this.props.events.length - 1].length === 0)
    ) {
      return false;
    }

    return true;
  }

  buildTile() {
    if (!this.eventsExist()) {
      return null;
    }

    let lastEvent = this.props.events[this.props.events.length - 1];
    return lastEvent.map((item, index) => {
      return (<TileItem
        key={ index }
        value={ this.getResultToShow(item.value, item.event.func) }
        param={{
          color: item.event.color,
          name: item.event.text,
          code: item.event.name
        }}
        canChartDisplay={ false }
        onlyBinaryValue={ false }
      />);
    });
  }

  getResultToShow(result, func) {
    if (func === 'COUNTER') {
      return moment().startOf('day')
        .seconds(result)
        .format('H:mm:ss');
    }

    return result;
  }

  render() {
    return (
      <div className='supervision-evenst'>
        <div className='supervision-evenst__header'>
          { (this.eventsExist()) &&
            <Translate value='supervision.events.header' />
          }
        </div>
        <div className='supervision-evenst__container'>
          { this.buildTile() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentFrame: state.supervisionData.currentFrame,
    events: state.supervisionData.events
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RealtimeEvents);
