import './three-dim-visualisation.sass';

import React, { Component } from 'react';
import { Subject } from 'rxjs/Subject';

import ThreeDimCesiumViewer from 'components/chart/three-dim-cesium-viewer/ThreeDimCesiumViewer';
import ThreeDimCesiumModel from 'components/chart/three-dim-cesium-model/ThreeDimCesiumModel';
import ThreeDimCesiumCamera from 'components/chart/three-dim-cesium-camera/ThreeDimCesiumCamera';

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
        <ThreeDimCesiumViewer
          setCesiumViewer={ this.setCesiumViewer.bind(this) }
        />
        <ThreeDimCesiumModel
          subjectViewer={ this.subjectViewer }
        />
        <ThreeDimCesiumCamera
          subjectViewer={ this.subjectViewer }
        />
      </div>
    );
  }
}
