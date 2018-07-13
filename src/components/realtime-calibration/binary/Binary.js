import './binary.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';

import TileItem from 'components/realtime-calibration/tile-item/TileItem';
import groupParams from 'components/realtime-calibration/utils/groupParams';

class Binary extends Component {
  buildTile() {
    let binary = this.props.params.binary;
    let groups = groupParams(binary);

    if (groups === null) {
      return binary.map((item, index) => {
        return this.getTile(item);
      });
    } else {
      let groupsTile = [];
      for (let ii = 0; ii < groups.names.length; ii++) {
        if (groups.blocks[groups.names[ii]].length) {
          groupsTile.push(
            <div className='realtime-calibration-binary__group' key={ 'groupsTile'+ii }>
              <p className='realtime-calibration-binary__group-title'>
                { groups.titles[ii] }
              </p>
              {
                groups.blocks[groups.names[ii]]
                  .map((item, index) => {
                    return this.getTile(item);
                  })
              }
            </div>
          );
        }
      }

      return groupsTile;
    }
  }

  getTile(param) {
    let value = false;

    if (this.props.binary.length > 0) {
      let lastTriggeredBp = this.props.binary[this.props.binary.length - 1];
      let searchedIndex = lastTriggeredBp.findIndex((binary) => {
        return param.id === binary.id;
      });

      if (searchedIndex !== -1) {
        value = true;
      }
    }

    return (<TileItem
      key={ 'BinaryTileItem' + param.id }
      param={ param }
      value={ value }
      canChartDisplay={ true }
      onlyBinaryValue={ true }
    />);
  }

  render() {
    return (
      <div className='realtime-calibration-binary'>
        <div className='realtime-calibration-binary__header'>
          { (this.props.params.binary.length > 0) && (
            <Translate value='realtimeCalibration.binary.header' />
          )}
        </div>
        <div className='realtime-calibration-binary__container'>
          { this.buildTile() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentFrame: state.realtimeCalibrationData.currentFrame,
    binary: state.realtimeCalibrationData.binary,
    params: state.realtimeCalibrationParams
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Binary);
