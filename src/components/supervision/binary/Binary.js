import './binary.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';

import TileItem from 'components/supervision/tile-item/TileItem';
import groupParams from 'components/supervision/utils/groupParams';

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
            <div className='supervision-binary__group' key={ 'groupsTile'+ii }>
              <p className='supervision-binary__group-title'>
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
      <div className='supervision-binary'>
        <div className='supervision-binary__header'>
          { (this.props.params.binary.length > 0) && (
            <Translate value='supervision.binary.header' />
          )}
        </div>
        <div className='supervision-binary__container'>
          { this.buildTile() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentFrame: state.supervisionData.currentFrame,
    binary: state.supervisionData.binary,
    params: state.supervisionParams
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Binary);
