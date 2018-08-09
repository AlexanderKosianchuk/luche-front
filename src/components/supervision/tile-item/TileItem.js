import './tile-item.sass';

import React, { Component } from 'react';

import ChartGroupIndicator from 'components/supervision/chart-group-indicator/ChartGroupIndicator';

export default function TileItem (props) {
  return (
    <div className='supervision-tile-item'>
      <div className={ 'supervision-tile-item__box' +
        (
          ((props.value === true) && props.onlyBinaryValue)
          ? ' supervision-tile-item__box--active'
          : ''
        ) + (
          (props.param.minValue
            && props.param.maxValue
            && ((props.value < props.param.minValue)
            || (props.value > props.param.maxValue))
            && !props.onlyBinaryValue
          )
          ? ' supervision-tile-item__box--alert'
          : ''
        )
      }
      >
        <div className='supervision-tile-item__colorbox'
          style={{ backgroundColor: ('#' + props.param.color) }}
        >
        </div>
        <div className='supervision-tile-item__container'>
          <div className='supervision-tile-item__code'>
            { props.param.code }
          </div>
          <div className='supervision-tile-item__name'>
            { props.param.name }
          </div>
          { !props.onlyBinaryValue &&
            <div className='supervision-tile-item__value'>
              { props.value }
            </div>
          }
        </div>
        { props.canChartDisplay &&
          <ChartGroupIndicator param={ props.param }/>
        }
      </div>
    </div>
  );
}
