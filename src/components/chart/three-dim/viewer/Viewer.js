import 'cesium/Widgets/widgets.css';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  BingMapsImageryProvider,
  BingMapsStyle,
  Credit,
  Viewer,
} from 'cesium/Cesium';

const MAP_ACCESS_TOKEN = 'ApsVJXOGQxuQ9trqqhGIlHd0rkTXvY9Fo4WCdvi4gQR64TQEZ4LtiTEjUkXwKTwa';

class ThreeDimViewer extends Component {
  componentDidMount() {
    this.create();
  }

  create() {
    if (this.viewer) {
      return;
    }

    var mapprovider = new BingMapsImageryProvider({
        url : '//dev.virtualearth.net',
        key : MAP_ACCESS_TOKEN,
        mapStyle : BingMapsStyle.AERIAL
    });

    this.viewer = new Viewer('cesiumContainer', {
      shouldAnimate: false,
      imageryProvider: mapprovider,
      baseLayerPicker: false,
      animation: true,
      geocoder: false,
      homeButton: false,
      fullscreenButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    });

    this.props.setCesiumViewer(this.viewer);
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.isDisplayed) {
      this.viewer.shouldAnimate = false;
    }

    return false;
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    idDisplayed: state.realtimePlayback.idDisplayed,
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeDimViewer);
