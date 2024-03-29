import './wrapper.sass';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuidV4 from 'uuid/v4';

import VerticalToolbar from 'components/supervision/vertical-toolbar/VerticalToolbar';
import DataContainer from 'components/supervision/data-container/DataContainer';
import Timeline from 'components/supervision/timeline/Timeline';
import ContentLoader from 'controls/content-loader/ContentLoader';

import request from 'actions/request';
import redirect from 'actions/redirect';
import transmit from 'actions/transmit';

class Wrapper extends Component {
  navigate(paramsSource = null) {
    let fdrId = this.props.fdrId;

    if ((
        !this.props.fdrId
          && Number.isInteger(parseInt(this.props.chosenFdr.id))
        ) ||
        (
          Number.isInteger(parseInt(this.props.chosenFdr.id))
          && (
            parseInt(this.props.fdrId)
            !== parseInt(this.props.chosenFdr.id)
          )
        )
    ) {
      fdrId = this.props.chosenFdr.id;
    }

    let fdrTemplateId = this.props.fdrTemplateId;

    if ((
        !this.props.fdrId
          && this.props.chosenFdrTemplates[0]
          && Number.isInteger(parseInt(this.props.chosenFdrTemplates[0].id))
        ) ||
        (
          this.props.chosenFdrTemplates[0]
          && Number.isInteger(parseInt(this.props.chosenFdrTemplates[0].id))
          && (
            parseInt(this.props.fdrTemplateId)
            !== parseInt(this.props.chosenFdrTemplates[0].id)
          )
        )
    ) {
      fdrTemplateId = this.props.chosenFdrTemplates[0].id;
    }

    if (paramsSource === null) {
      paramsSource = this.props.paramsSource;
    }

    let fdrTemplateIdUrl = '';
    if ((paramsSource === 'template')
      && (fdrTemplateId !== null)
    ) {
      fdrTemplateIdUrl = `/fdr-template-id/${fdrTemplateId}`;
    }

    this.props.redirect(`/supervision/fdr-id/${fdrId}`
      + `/params-sourse/${paramsSource}`
      + fdrTemplateIdUrl,
      true
    );
  }

  componentWillMount() {
    this.UID = uuidV4().substring(0, 18).replace(/-/g, '');

    this.navigate();
    this.setContainerParams();
  }

  componentDidUpdate() {
    this.navigate();
    this.setContainerParams();
  }

  changeParamsSource(newSource) {
    this.navigate(newSource);
  }

  setContainerParams() {
    if ((this.props.paramsSource === 'template')
      && (this.props.chosenFdrTemplates.length > 0)
      && (this.props.chosenFdrTemplates[0].params.length > 0)
    ) {
      this.props.transmit('CLEAR_SUPERVISION_PARAMS')
        .then(() => {
          this.props.chosenFdrTemplates[0].params.forEach((param) => {
            this.props.transmit('CHANGE_SUPERVISION_PARAMS_CHECKSTATE', {
              ...param,
              ...{ state: true }
            });
          });
        });
    }
  }

  render() {
    if (!Number.isInteger(parseInt(this.props.fdrId))) {
      return <ContentLoader/>
    }

    return (
      <div className='supervision-wrapper'>
        <div className='row'>
          <Timeline uid={ this.UID } fdrId={ parseInt(this.props.fdrId) }/>
        </div>
        <div className='row'>
          <div className='col-sm-3 col-lg-2'>
            <VerticalToolbar
              uid={ this.UID }
              fdrId={ parseInt(this.props.fdrId) }
              paramsSource={ this.props.paramsSource }
              fdrTemplateId={ this.props.fdrTemplateId }
              changeParamsSource={ this.changeParamsSource.bind(this) }
            />
          </div>
          <div className='col-sm-9 col-lg-10'>
            <DataContainer uid={ this.UID } />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fdrsFetching: state.fdrs.pending,
    chosenFdr: state.fdrs.chosen,
    chosenFdrTemplates: state.fdrTemplates.chosenItems,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(request, dispatch),
    redirect: bindActionCreators(redirect, dispatch),
    transmit: bindActionCreators(transmit, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
