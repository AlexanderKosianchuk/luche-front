import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FlightTemplateEditToolbar from 'controls/flight-template-edit-toolbar/FlightTemplateEditToolbar';
import Params from 'components/flight-template-update/params/Params';

import Menu from 'controls/menu/Menu';
import ContentLoader from 'controls/content-loader/ContentLoader';

import request from 'actions/request';
import transmit from 'actions/transmit';

class FlightTemplateUpdate extends Component {
  componentDidMount() {
    if ((this.props.passedTemplateId !== this.props.storedTemplateId)) {
      this.props.request(
        ['flightTemplate', 'get'],
        'get',
        'FLIGHT_TEMPLATE',
        {
          flightId: this.props.flightId,
          templateId: this.props.passedTemplateId
        }
      ).then((payload) => {
        if (payload && payload.params && payload.params.length) {
          this.setChosenParams(payload.params);
        } else {
          this.setChosenParams([]);
        }
      })
    } else {
      this.setChosenParams(this.props.templateParams);
    }
  }

  setChosenParams(list) {
    let templateAnalogParams = list
      .filter((item) => (item.type === 'ap'))
      .map((item) => { return { id: item.id, type: item.type }});

    let templateBinaryParams = list
      .filter((item) => (item.type === 'bp'))
      .map((item) => { return { id: item.id, type: item.type }});

    this.props.transmit('SET_CHECKED_FLIGHT_PARAMS', {
      ap: templateAnalogParams,
      bp: templateBinaryParams
    });
  }

  buildBody() {
    if ((this.props.passedTemplateId !== this.props.storedTemplateId)) {
      return <ContentLoader/>;
    } else {
      return (<span>
        <FlightTemplateEditToolbar
          flightId={ this.props.flightId }
          templateId={ this.props.passedTemplateId }
          templateName={ this.props.templateName }
        />
        <Params
          flightId={ this.props.flightId }
          colorPickerEnabled={ false }
        />
      </span>);
    }
  }

  render () {
    return (
      <div>
        <Menu/>
        { this.buildBody() }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    templatePending: state.flightTemplate.pending,
    flightId: ownProps.match.params.flightId,
    passedTemplateId: ownProps.match.params.templateId,
    storedTemplateId: state.flightTemplate.id,
    templateName: state.flightTemplate.name,
    templateParams: state.flightTemplate.params
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    transmit: bindActionCreators(transmit, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightTemplateUpdate);
