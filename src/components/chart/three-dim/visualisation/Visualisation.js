import './visualisation.sass';

import React, { Component } from 'react';
import { Subject } from 'rxjs/Subject';
import { connect } from 'react-redux';

import Viewer from 'components/chart/three-dim/viewer/Viewer';
import Model from 'components/chart/three-dim/model/Model';
import Clock from 'components/chart/three-dim/clock/Clock';
import DataProvider from 'components/chart/three-dim/data-provider/DataProvider';

const CHART_WITH_3D_RATIO = 0.6;
const HEADER_HEIGHT = 105;

class Visualisation extends Component {
  constructor(props) {
    super(props);

    this.subjectViewer = new Subject();
  }

  componentDidMount() {
    this.container.style.height = ((window.innerHeight - HEADER_HEIGHT)
      * CHART_WITH_3D_RATIO) + 'px';
  }

  setCesiumViewer(cesiumViewer) {
    if (cesiumViewer) {
      this.subjectViewer.next(cesiumViewer);
    }
  }

  render() {
    return (
      <div
        id='cesiumContainer'
        className={ 'chart-three-dim-visualisation'
          + (this.props.isDisplayed ? '' : ' chart-three-dim-visualisation--is-hidden') }
        ref={ (container) => this.container = container }
      >
        <Viewer
          setCesiumViewer={ this.setCesiumViewer.bind(this) }
        />
        <Model subjectViewer={ this.subjectViewer } />
        <Clock subjectViewer={ this.subjectViewer } />
        <DataProvider flightId={ this.props.flightId }/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isDisplayed: state.realtimePlayback.isDisplayed
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualisation);
