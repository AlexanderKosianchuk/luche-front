import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate, I18n } from 'react-redux-i18n';
import styled, { css } from 'react-emotion'

import FdrSelector from 'controls/fdr-selector/FdrSelector';
import CalibrationSelector from 'controls/calibration-selector/CalibrationSelector';

import ChooseParamsButtons from 'components/supervision/choose-params-buttons/ChooseParamsButtons';
import DataSource from 'components/supervision/data-source/DataSource';

import transmit from 'actions/transmit';
import request from 'actions/request';
import redirect from 'actions/redirect';
import trigger from 'actions/trigger';

import objectToFormData from 'utilities/objectToFormData';

class VerticalToolbar extends Component {
  static form = null;

  constructor(props) {
    super(props);

    this.dataSource = { get: () => {} };

    this.state = { sessionStarted: false };

    /*window.onbeforeunload = () => {
      return 'Are you sure you want to leave?';
    };*/
  }

  componentWillUnmount() {
    window.onbeforeunload = null;

    if (this.props.isRunning === null) {
      return false;
    }

    this.sendRequest(
      'STOP_SUPERVISION_DATA_TRANSMITTIG',
      'stop'
    );

    this.props.transmit('CLEAR_SUPERVISION_DATA');
  }

  handleStartClick(event) {
    event.preventDefault();

    if (this.props.isRunning !== null) {
      return false;
    }

    this.sendRequest(
      'START_SUPERVISION_DATA_TRANSMITTIG',
      'start'
    ).then(() => {
      this.setState({ sessionStarted: true });
    }).catch((resp) => {
      if (resp && resp.message) {
        alert(resp.message);
      }
    })
  }

  handlePauseClick(event) {
    event.preventDefault();

    if (this.props.isRunning !== true) {
      return false;
    }

    this.sendRequest(
      'PAUSE_SUPERVISION_DATA_TRANSMITTIG',
      'pause'
    );

    this.setState({ sessionStarted: false });
  }

  handleResumeClick(event) {
    event.preventDefault();

    if (this.props.isRunning !== false) {
      return false;
    }

    this.sendRequest(
      'START_SUPERVISION_DATA_TRANSMITTIG',
      'start'
    );

    this.setState({ sessionStarted: true });
  }

  sendRequest (actionType, interactionAction) {
    let source = this.dataSource.get();

    if (!source) {
      return null;
    }

    let formData = objectToFormData({
      ...{ uid: this.props.uid,
        fdrId: this.props.chosenFdr.id,
        calibrationId: this.props.chosenCalibration
          ? this.props.chosenCalibration.id
          : null,
        cors: window.location.hostname
      },
      ...source
    });

    let url = INTERACTION_URL + 'SupervisionBroadcasting' + '/' + interactionAction;

    return this.props.request(
      url,
      'post',
      actionType,
      formData,
      { credentials: 'omit' }
    );
  }

  handleSaveClick() {
    //88ac42ed2685402f/fdr-id/1/calibration-id/9
    let url = '/uploading/'
      + this.props.uid
      + '/fdr-id/'
      + this.props.chosenFdr.id;

    if (this.props.chosenCalibration
        && this.props.chosenCalibration.id
    ) {
      url += '/calibration-id/'
        + this.props.chosenCalibration.id;
    }

    this.props.redirect(url);
  }

  putStateButton() {
    if (this.props.isRunning === true) {
      return (<button
        className={ Button + ' btn btn-default' }
        onClick={ this.handlePauseClick.bind(this) }
      >
        <Translate value='supervision.verticalToolbar.stop'/>
      </button>);
    } else if (this.props.isRunning === false) {
      return (
        <div>
          <button
            className={ Button + ' btn btn-default' }
            onClick={ this.handleResumeClick.bind(this) }
          >
            <Translate value='supervision.verticalToolbar.start'/>
          </button>
          <button
            className={ Button + ' btn btn-default' }
            onClick={ this.handleSaveClick.bind(this) }
          >
            <Translate value='supervision.verticalToolbar.save'/>
          </button>
        </div>
      );
    }

    return (<button
      className={ Button + ' btn btn-default' }
      onClick={ this.handleStartClick.bind(this) }
    >
      <Translate value='supervision.verticalToolbar.start'/>
    </button>);
  }

  render() {
    return (
      <StyledForm ref={ (form) => { this.form = form; } }>
        <div className={ ConnectionParams }>
          <Translate value='supervision.verticalToolbar.connectionParams'/>
        </div>
        <div className={ Label }>
          <Translate value='supervision.verticalToolbar.fdrType'/>
        </div>
        <div>
          <ul className={ FdrType }>
            <FdrSelector
              chosenFdrId={ this.props.fdrId }
              disabled={ this.state.sessionStarted }
            />
            <CalibrationSelector
              disabled={ this.state.sessionStarted }
            />
          </ul>
        </div>
        <DataSource
          sessionStarted={ this.state.sessionStarted }
          dataSource={ this.dataSource }
        />
        <ChooseParamsButtons
          fdrId={ this.props.fdrId }
          paramsSource={ this.props.paramsSource }
          fdrTemplateId={ this.props.fdrTemplateId }
          changeParamsSource={ this.props.changeParamsSource }
        />
        <div>
          { this.putStateButton() }
        </div>
      </StyledForm>
    );
  }
}

const StyledForm = styled('form')`
  padding: 6px;
  border: 1px solid #e7e7e7;
  background-color: #f8f8f8;
  text-align: center;

  .select2-container {
    width: 100% !important;
  }
`

const ConnectionParams = css`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  padding: 2px 0;
`

const FdrType = css`
  list-style-type: none;
  padding: 5px 10px;
`


const Label = css`
  padding: 5px;
`

const Button = css`
  margin: 2px 8px;
`

function mapStateToProps(state) {
  return {
    isRunning: state.supervisionData.status,
    chosenFdr: state.fdrs.chosen,
    fdr: state.fdrs,
    chosenCalibration: state.calibrations.chosen,
    calibration: state.calibrations
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch),
    request: bindActionCreators(request, dispatch),
    redirect: bindActionCreators(redirect, dispatch),
    trigger: bindActionCreators(trigger, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerticalToolbar);
