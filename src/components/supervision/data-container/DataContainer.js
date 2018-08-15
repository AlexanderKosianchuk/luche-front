import './data-container.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';

import ChartsContainer from 'components/supervision/charts-container/ChartsContainer';
import Physics from 'components/supervision/physics/Physics';
import Events from 'components/supervision/events/Events';
import Binary from 'components/supervision/binary/Binary';
import VoiceStreams from 'components/supervision/voice-streams/VoiceStreams';

import bindSocketEvent from 'actions/bindSocketEvent';

const SUPERVISION_NEW_DATA_SOCKET_EVENT = 'newData';

class DataContainer extends Component {
  componentDidMount() {
    if (this.props.status === true) {
      this.bindSocketEvent(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === true) {
      this.bindSocketEvent(nextProps);
    }
  }

  bindSocketEvent(props) {
    props.bindSocketEvent({
      io: props.io,
      ioEvent: SUPERVISION_NEW_DATA_SOCKET_EVENT,
      bindedEvents: props.bindedEvents,
      registerUrl: INTERACTION_URL + 'socket/registerToSupervisionDataRoom?uid='+ props.uid,
      reducerEvent: 'RECEIVED_SUPERVISION_NEW_DATA'
    });
  }

  render() {
    return (
      <div className='supervision-data-container'>
        <div className='supervision-data-container__output'>
          <div className='supervision-data-container__charts'>
            <ChartsContainer/>
          </div>
          <div className='supervision-data-container__events'>
            <Events/>
          </div>
          <div className='supervision-data-container__params'>
            <Physics/>
          </div>
          <div className='supervision-data-container__binary'>
            <Binary/>
          </div>
          <div className='supervision-data-container__voice'>
            <VoiceStreams/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.webSockets.status,
    io: state.webSockets.io,
    bindedEvents: state.webSockets.bindedEvents,
    errorCode: state.supervisionData.errorCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    bindSocketEvent: bindActionCreators(bindSocketEvent, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
