import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Translate, I18n } from 'react-redux-i18n';
import moment from 'moment';

import ContentLoader from 'controls/content-loader/ContentLoader';
import ValuesRow from 'components/flight-statistics/values-row/ValuesRow';

class Values extends Component {
  toHHMMSS(secs) {
    let sec_num = parseInt(secs, 10)
    let hours   = Math.floor(sec_num / 3600) % 24
    let minutes = Math.floor(sec_num / 60) % 60
    let seconds = sec_num % 60
    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
  }

  toSeconds(timeStr) {
    let p = timeStr.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
  }

  buildReport(pending, data) {
    if (pending === null) {
      return I18n.t('flightStatistics.values.setParamsForReportGenerating');
    }

    if (pending) {
      return <ContentLoader margin={ 5 } size={ 75 } />;;
    }

    if (!data || data.length === 0) {
      return I18n.t('flightStatistics.values.noDataToGenerateReport');
    }

    let rows = [];
    rows.push(
      <ValuesRow key="title" i18n={ this.props.i18n } />
    );
    data.forEach((item, index) => {
      if (item.text && item.values && item.values.length) {
        let count = item.values.length;
        let sum = 0;
        let avg = 0;
        let min = 0;
        let max = 0;

        if (item.values[0].includes(':')) {
          let sumInSeconds = item.values.reduce((sum, next) => this.toSeconds(next) + sum, 0);
          sum = this.toHHMMSS(sumInSeconds);
          avg = this.toHHMMSS(sumInSeconds / count);
          min = this.toHHMMSS(item.values.reduce((val, next) => {
            if (this.toSeconds(next) < val) {
              val = this.toSeconds(next)
            }

            return val;
          }, this.toSeconds(item.values[0])));

          max = this.toHHMMSS(item.values.reduce((val, next) => {
            if (this.toSeconds(next) > val) {
              val = this.toSeconds(next)
            }

            return val;
          }, this.toSeconds(item.values[0])));
        } else {
          sum = item.values.reduce((next, sum) => next + sum, 0);
          avg = sum / count;
          min = Math.min.apply(null, item.values);
          max = Math.max.apply(null, item.values);
        }

        rows.push(
          <ValuesRow
            key={ index }
            title={ item.text }
            count={ count }
            sum={ sum }
            avg={ avg }
            min={ min }
            max={ max }
          />
        );
      }
    });

    return rows;
  }

  render() {
    let body = this.buildReport(this.props.pending, this.props.data);
    return (
      <div>
        <p><b><Translate value='flightStatistics.values.results' /></b></p>
        { body }
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    pending: store.flightStatistics.pending,
    data: store.flightStatistics.data
  }
}

export default connect(mapStateToProps)(Values);
