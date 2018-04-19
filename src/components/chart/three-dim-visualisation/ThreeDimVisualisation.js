import './three-dim-visualisation.sass';
import 'cesium/Widgets/widgets.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Cesium from 'cesium/Cesium';

const CHART_WITH_3D_RATIO = 0.6;
const HEADER_HEIGHT = 105;

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGVkYW5hYW4wMCIsImEiOiJjamc2bDBnNjAxMmY3MnpzMG9sdnVsMGhsIn0.qAgylJX9eHK0n9ni6rUkKg';

class ThreeDimVisualisation extends Component {
  componentDidMount() {
    this.container.style.height = ((window.innerHeight - HEADER_HEIGHT)
      * CHART_WITH_3D_RATIO) + 'px';

    // Mapbox tile provider
    let mapbox = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.streets-satellite',
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    this.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: mapbox,
      baseLayerPicker: false,
      animation: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      timeline: false
    });
  }

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  render() {
    return (
      <div
        id='cesiumContainer'
        ref={ (container) => this.container = container }
      >
      </div>
    );
  }
}

ThreeDimVisualisation.propTypes = {
};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimVisualisation);
