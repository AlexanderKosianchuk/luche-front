import './realtime-chart.sass';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Line, defaults } from 'react-chartjs-2';

import transmit from 'actions/transmit';

const LOCKED_SCALE_TIMEOUT = 2000;

class RealtimeChart extends Component {
  constructor(props) {
    super(props);
    defaults.global.animation = false;
    this.isScaleAllowed = { min: true, max: true };
    this.yAxesMin = this.props.param.minValue;
    this.yAxesMax = this.props.param.maxValue;
  }

  getData() {
    return {
      labels: this.props.timeline.length > 0 ? this.props.timeline : [0],
      datasets: [{
        fill: false,
        label: this.props.param.code,
        backgroundColor: '#' + this.props.param.color,
        borderColor: '#' + this.props.param.color,
        data: this.props.line
      }]
    };
  }

  lockScale(val) {
    if (this.isScaleAllowed[val] === false) {
      return;
    }

    this.isScaleAllowed[val] = false;

    setTimeout(() => {
      this.isScaleAllowed[val] = true;
    }, LOCKED_SCALE_TIMEOUT);
  }

  calcAxesVal(side, current) {
    let region = this.props.param.minValue + this.props.param.maxValue;

    let minOnLine = (this.props.line.length > 0)
      ? Math.min(...this.props.line) : this.props.param.minValue;
    let maxOnLine = (this.props.line.length > 0)
      ? Math.max(...this.props.line) : this.props.param.maxValue;

    let axisValue = 0;

    if (side === 'min') {
      axisValue = Math[side](
        this.props.param[side + 'Value'] - region * 0.2,
        minOnLine - Math.abs((maxOnLine - minOnLine) * 0.2)
      );
    } else if (side === 'max') {
      axisValue = Math[side](
        this.props.param[side + 'Value'] + region * 0.2,
        maxOnLine + Math.abs((maxOnLine - minOnLine) * 0.2)
      );
    }

    if ((axisValue !== current)
        && this.isScaleAllowed[side]
    ) {
      this.lockScale(side);
      return axisValue;
    }

    return current;
  }

  getOptions() {
    let options = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'second'
          }
        }]
      },
      legend: {
        onClick: (e) => e.stopPropagation()
      }
    };

    if ((this.yAxesMin !== 0) && (this.yAxesMax !== 1)) {
      options.scales.yAxes = [{
         display: true,
         stacked: true,
         ticks: {
           min: this.yAxesMin,
           max: this.yAxesMax
         }
      }]
    }

    return options;
  }

  handleClick() {
    this.props.transmit('CHANGE_REALTIME_CALIBRATION_CHART_PARAM_CHECKSTATE', {
      ...this.props.param,
      ...{ state: false }
    });
  }

  render() {
    return (
      <div className='realtime-calibration-realtime-chart'>
        <Line
          height={ this.props.isBinary ? 100 : 280 }
          data={ this.getData() }
          options={ this.getOptions() }
          redraw={ true }
        />
        <div
          className='realtime-calibration-realtime-chart__checkbox'
          onClick={ this.handleClick.bind(this) }
        >
          <span className='glyphicon glyphicon-remove'></span>
        </div>
      </div>
    );
  }
}

RealtimeChart.propTypes = {
  param: PropTypes.object.isRequired,
  line: PropTypes.array.isRequired,
  timeline: PropTypes.array.isRequired,
  transmit: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    transmit: bindActionCreators(transmit, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealtimeChart);
