/*jslint browser: true*/
/*global $, jQuery, FlightUploader, Chart*/

'use strict';

// libs
import 'jquery';
import 'bootstrap-loader';

// old prototypes
import FlightUploader from 'FlightUploader';
import ChartService from 'Chart';

import { push } from 'react-router-redux'
import startFlightUploading from 'actions/particular/startFlightUploading';

export default function facade(store) {
  let chartService = null;

  $(document).on('importItem', function (e, form) {
    let dfd = $.Deferred();
    let FU = new FlightUploader(store);
    FU.Import(form, dfd);
    dfd.promise();

    dfd.then(() => {
      // TODO add item to redux flightsList
    });
  });

  $(document).on('uploadWithPreview', function (e, container, uploadingUid, fdrId, calibrationId) {
    let FU = new FlightUploader(store);
    FU.FillFactoryContaider($(container), uploadingUid, fdrId, calibrationId);
  });

  $(document).on('uploadPreviewedFlight', function(uploadingUid, fdrId, calibrationId) {
    let FU = new FlightUploader(store);
    FU.uploadPreviewed().then(() => {
      //store.dispatch(push('/'));
    });
  });

  $(document).on('startProccessing', function (e, uploadingUid) {
    store.dispatch(startFlightUploading({
      uploadingUid: uploadingUid
    }));
  });

  $(document).on('endProccessing', function (e, uploadingUid, item) {
    store.dispatch({
      type: 'FLIGHT_UPLOADING_COMPLETE',
      payload: {
        uploadingUid: uploadingUid,
        item: item
      }
    });
  });

  $(document).on('chartShow', function (e, data) {
    chartService = new ChartService(store);
    chartService.SetChartData(data);
    chartService.FillFactoryContaider($(data.container));
  });

  $(document).on('toggleThreeDimIsShown', function () {
    if (chartService !== null) {
      chartService.threeDimIsShown = !chartService.threeDimIsShown;
      chartService.ResizeChart();
      chartService.PlotRedraw();
    }
  });
}
