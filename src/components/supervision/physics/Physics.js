import './physics.sass';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate, I18n } from 'react-redux-i18n';

import TileItem from 'components/supervision/tile-item/TileItem';
import groupParams from 'components/supervision/utils/groupParams';

class Physics extends Component {
  buildTile() {
    let ap = this.props.params.analog;

    let newFrame = new Array(ap.length);
    if (this.props.data.length > 0) {
      newFrame = this.props.data[this.props.data.length - 1];
    }

    let groups = groupParams(ap);

    if (groups === null) {
      return ap.map((item, index) => {
        return (<TileItem
          key={ index }
          value={ this.getValue(newFrame[item.id]) }
          param={ item }
          canChartDisplay={ true }
          onlyBinaryValue={ false }
        />);
      });
    } else {
      let groupsTile = [];
      for (let ii = 0; ii < groups.names.length; ii++) {
        if (groups.blocks[groups.names[ii]].length) {
          groupsTile.push(
            <div className='supervision-physics__group' key={ 'groupsTile'+ii }>
              <p className='supervision-physics__group-title'>
                { groups.titles[ii] }
              </p>
              {
                groups.blocks[groups.names[ii]]
                  .map((item, index) => {
                    return (<TileItem
                      key={ index }
                      value={ this.getValue(newFrame[item.id]) }
                      param={ item }
                      canChartDisplay={ true }
                      onlyBinaryValue={ false }
                    />);
                  })
              }
            </div>
          );
        }
      }

      return groupsTile;
    }
  }

  getValue (value) {
    if (value) {
      return Number((value).toFixed(2))
    }

    return 0;
  }

  render() {
    return (
      <div className='supervision-physics'>
        <div className='supervision-physics__header'>
          { (this.props.params.analog.length === 0) ? (
            <Translate value='supervision.physics.chooseParams'/>
          ) : (
            <Translate value='supervision.physics.header' />
          )}
        </div>
        <div className='supervision-physics__container'>
          { this.buildTile() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentFrame: state.supervisionData.currentFrame,
    data: state.supervisionData.phisics,
    params: state.supervisionParams
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Physics);
