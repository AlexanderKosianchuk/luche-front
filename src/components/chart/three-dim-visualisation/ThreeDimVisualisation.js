import './three-dim-visualisation.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const CHART_WITH_3D_RATIO = 0.6;
const HEADER_HEIGHT = 105;

class ThreeDimVisualisation extends Component {
  componentDidMount() {
    this.container.style.height = ((window.innerHeight - HEADER_HEIGHT)
      * CHART_WITH_3D_RATIO) + 'px';

    //var viewer = new Cesium.Viewer('cesiumContainer');
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
