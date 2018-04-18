import './values-row.sass';

import React from 'react';
import { Translate } from 'react-redux-i18n';

export default function ValuesItem (props) {
  return (
    <div className='flight-statistics-report-row row'>
      <div className='flight-statistics-report-row__col-title'>
        { props.title ? props.title : <b><Translate value='flightStatistics.valuesRow.title' /></b> }
      </div>
      <div className='flight-statistics-report-row__col-value'>
        { props.count ? props.count : <b><Translate value='flightStatistics.valuesRow.count' /></b> }
      </div>
      <div className='flight-statistics-report-row__col-value'>
        { props.min ? props.min : <b><Translate value='flightStatistics.valuesRow.min' /></b> }
      </div>
      <div className='flight-statistics-report-row__col-value'>
        { props.avg ? props.avg : <b><Translate value='flightStatistics.valuesRow.avg' /></b> }
      </div>
      <div className='flight-statistics-report-row__col-value'>
        { props.sum ? props.sum : <b><Translate value='flightStatistics.valuesRow.sum' /></b> }
      </div>
      <div className='flight-statistics-report-row__col-value'>
        { props.max ? props.max : <b><Translate value='flightStatistics.valuesRow.max' /></b> }
      </div>
    </div>
  );
}
