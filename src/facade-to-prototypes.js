/*jslint browser: true*/
/*global $, jQuery, FlightUploader, Chart*/

'use strict';

// libs
import 'jquery';
import 'bootstrap-loader';

//old styles
import 'style/style.css';

// old prototypes
import FlightUploader from 'FlightUploader';
import ChartService from 'Chart';

import { push } from 'react-router-redux'
import startFlightUploading from 'actions/particular/startFlightUploading';

export default function facade(store) {
  $(document).on('importItem', function (e, form) {
    let dfd = $.Deferred();
    let FU = new FlightUploader(store);
    FU.Import(form, dfd);
    dfd.promise();

    dfd.then(() => {
      // TODO add item to redux flightsList
    });
  });

  $(document).on('uploadWithPreview', function (e, showcase, uploadingUid, fdrId, calibrationId) {
    let FU = new FlightUploader(store);
    FU.FillFactoryContaider(showcase, uploadingUid, fdrId, calibrationId);
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

  $(document).on('chartShow', function (
    e, showcase,
    flightId, templateId,
    stepLength, startCopyTime,
    startFrame, endFrame,
    apParams, bpParams,
    hasCoordinates
  ) {
    var C = new ChartService(store);
    C.SetChartData(
      flightId, templateId,
      stepLength, startCopyTime,
      startFrame, endFrame,
      apParams, bpParams,
      hasCoordinates
    );
    C.FillFactoryContaider(showcase);
  });

  $(document).on('uploadPreviewedFlight', function(uploadingUid, fdrId, calibrationId) {
    let FU = new FlightUploader(store);
    FU.uploadPreviewed().then(() => {
      store.dispatch(push('/'));
    });
  });
}
