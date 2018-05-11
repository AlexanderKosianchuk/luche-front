import './three-dim-visualisation.sass';

import React, { Component } from 'react';
import { Subject } from 'rxjs/Subject';

import Viewer from 'components/chart/three-dim-cesium-viewer/ThreeDimCesiumViewer';
import Model from 'components/chart/three-dim-cesium-model/ThreeDimCesiumModel';
import Clock from 'components/chart/three-dim-cesium-clock/ThreeDimCesiumClock';

const CHART_WITH_3D_RATIO = 0.6;
const HEADER_HEIGHT = 105;

export default class ThreeDimVisualisation extends Component {
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
        ref={ (container) => this.container = container }
      >
        <Viewer setCesiumViewer={ this.setCesiumViewer.bind(this) } />
        <Model subjectViewer={ this.subjectViewer } />
        <Clock subjectViewer={ this.subjectViewer } />
        <Camera subjectViewer={ this.subjectViewer } />
      </div>
    );
  }
}
