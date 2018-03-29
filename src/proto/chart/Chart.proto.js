import 'assets/images/loading.gif';

import 'flot-charts';
import 'flot-charts/jquery.flot.time';
import 'flot-charts/jquery.flot.symbol';
import 'flot-charts/jquery.flot.navigate';
import 'flot-charts/jquery.flot.crosshair';
import 'flot-charts/jquery.flot.resize';
import 'jquery-ui/ui/widgets/resizable';

import transmit from 'actions/transmit';

import Param from 'Param';
import AxesWorker from 'AxesWorker';
import Exception from 'Exception';
import Legend from 'Legend';

var PARAM_TYPE_AP = 'ap';
var PARAM_TYPE_BP = 'bp';
var CHART_WITH_3D_RATIO = 0.4;
var HEADER_HEIGHT = 105;

function Chart(store) {
  this.store = store;

  let state = store.getState();

  this.mainChartColor = state.settings.items.mainChartColor || 'fff';
  this.lineWidth = state.settings.items.lineWidth || 1;

  this.chartFactoryContainer = null;
  this.chartWorkspace = null;
  this.chartContent = null;

  this.legend = null;
  this.placeholder = null;
  this.plot = null;
  this.plotOptions = {};
  this.Prm = null;
  this.plotYaxArr = null;
  this.plotAxes = null;
  this.plotDataset = null;
  this.AxesWrk = null;
  this.Exc = null;
  this.Legnd = null;

  //
  this.clickedItem = new Object();
  this.clicked = false;
  this.ctrlPressed = false;
  this.shiftPressed = false;
  this.horLineSetting = false;
  this.markingCount = 1;
  this.keybordEventsSupported = false;
  //self.horLineSetting supports on plotover event hor line moving

  //data need to display chart
  this.user = null;
  this.templateId = null;
  this.flightId = null;
  this.stepLength = null;
  this.startCopyTime = null;
  this.apParams = null;
  this.bpParams = null;
  this.startFrame = null;
  this.endFrame = null;

  this.startFrameTime = null;
  this.endFrameTime = null;
  this.mouseInChat = false;
  this.hasCoordinates = false;

  $(document).on('chart:hideParamsList', this.hideParamsList.bind(this) );
  $(document).on('chart:showParamsList', this.showParamsList.bind(this) );
  $(document).on('chart:fullSize', this.fullSize.bind(this) );
}

Chart.prototype.SetChartData = function(flightId, templateId,
    stepLength, startCopyTime, startFrame, endFrame,
    apParams, bpParams, hasCoordinates){

  this.flightId = parseInt(flightId);
  this.templateId = templateId;
  this.stepLength = parseFloat(stepLength);
  this.startCopyTime = parseInt(startCopyTime);
  this.startFrame = parseInt(startFrame);
  this.endFrame = parseInt(endFrame);
  this.apParams = apParams;
  this.bpParams = bpParams;

  this.startFrameTime = this.startCopyTime + (this.startFrame * this.stepLength);
  this.endFrameTime = this.startCopyTime + (this.endFrame * this.stepLength);

  this.markingCount = this.apParams.length + this.bpParams.length + 1;
  this.hasCoordinates = hasCoordinates || false;
}

Chart.prototype.FillFactoryContaider = function(factoryContainer) {
  var self = this;
  this.chartFactoryContainer = factoryContainer;

  this.chartFactoryContainer.append(
    $('<div></div>')
      .attr('id', 'chartWorkspace')
      .addClass('WorkSpace')
  );

  self.chartWorkspace = $('div#chartWorkspace');

  this.chartWorkspace.append(
    $('<div></div>')
      .attr('id', 'graphContainer')
      .addClass('GraphContainer')
  );

  self.chartContent = $('div#graphContainer');

  this.chartContent.append(
    $('<div></div>')
      .attr('id', 'placeholder')
      .attr('data-bgcolor', this.mainChartColor)
      .attr('data-linewidth', this.lineWidth)
  );
  self.placeholder = $('div#placeholder');

  this.chartContent.append(
    $('<div></div>').attr('id', 'legend')
  );
  self.legend = $('div#legend');

  this.chartWorkspace.append(
    $('<div></div>')
      .attr('id', 'loadingBox')
  );
  self.loadingBox = $("div#loadingBox")
  self.loadingBox.append(
    $('<img/>').attr('src', './images/loading.gif')
  );

  self.placeholder.on("mouseover", function(e){
    self.mouseInChat = true;
  });

  self.placeholder.on("mouseout", function(e){
    self.mouseInChat = false;
  });

  self.ResizeChart();

  self.LoadFlotChart();

  self.chartWorkspace
    .resizable({
      stop: (event, ui) => {
        self.ResizeChart.apply(self, [ event, ui.size ]);
        self.PlotRedraw.call(self);
      }
    });
}

Chart.prototype.PlotRedraw = function() {
  this.plot.resize();
  this.plot.setupGrid();
  this.plot.draw();
  this.plot.pan(0);
}

Chart.prototype.hideParamsList = function() {
  this.legend.addClass('is-hidden');

  this.placeholder.css({
    width: ((this.chartContent.width() - 30 +
      (this.apParams.length + this.bpParams.length) * 18) + 'px')
  });

  this.PlotRedraw();
};

Chart.prototype.showParamsList = function() {
  this.legend.removeClass('is-hidden');

  this.placeholder.css({
    width: ((this.chartContent.width() - (this.legend.width() + 30) +
      (this.apParams.length + this.bpParams.length) * 18) + 'px')
  });

  this.PlotRedraw();
};

Chart.prototype.fullSize = function() {
  this.ResizeChart(
    null, {
      height: (height = $(window).height() - HEADER_HEIGHT)
        * (this.hasCoordinates ? CHART_WITH_3D_RATIO : 1),
      width: $(window).width()
    }
  );

  this.PlotRedraw();
}

Chart.prototype.ResizeChart = function(e, size = null) {
  var self = this;

  let baseHeight = ($(window).height() - HEADER_HEIGHT)
    * (this.hasCoordinates ? CHART_WITH_3D_RATIO : 1);
  let baseWidth = $(window).width();

  if (size && size.height && size.width) {
    baseHeight = size.height;
    baseWidth = size.width;
  }

  if (self.chartWorkspace != null) {
    self.chartWorkspace.css({
      height: baseHeight + 'px',
      width: baseWidth + 'px'
    });
  }

  if ((self.chartWorkspace != null) &&
    (self.chartContent != null)
  ) {
    self.chartContent.css({
      'height': self.chartWorkspace.height(),
      'width': self.chartWorkspace.width()
    });
  }

  if ((self.chartContent != null)
    && (self.placeholder != null)
    && (self.legend != null)
    && (self.apParams != null)
    && (self.bpParams != null)
  ) {
    self.legend.css({
      'height': self.chartContent.height() - 35 + 'px',
    });

    self.placeholder.css({
      height: self.chartContent.height() - 35 + 'px',
      width: ((self.chartContent.width() - (self.legend.width() + 30) +
        (self.apParams.length + self.bpParams.length) * 18) + 'px')
    });

    if ((self.apParams.length == 1) && (self.bpParams.length == 0)){
      self.placeholder.css('margin-left',  '-7px');
    } else {
      self.placeholder.css('margin-left',  '-' +
        ((self.apParams.length + self.bpParams.length - 1) * 18) + 'px');
    }
  }

  return;
}

Chart.prototype.LoadFlotChart = function() {
  //flot options
  var self = this;
  var bg = "#"+self.placeholder.data('bgcolor');
  self.plotOptions = {
      xaxis: {
        mode: "time",
        timezone: "browser",
        tickColor: "rgba(220, 220, 220, 0.8)",
        min: (new Date(self.startFrameTime * 1000)).getTime(),
        max: (new Date(self.endFrameTime * 1000)).getTime()
      },
      yaxis:{
        ticks: 0,
        position : "left",
        zoomRange: false,
      },
      zoom: {
        interactive: true,
      },
      pan: {
        interactive: true,
      },
      crosshair: {
        mode: "x",
      },
      grid: {
        hoverable: true,
        clickable: true,
        tickColor: "rgba(220, 220, 220, 0.8)",
        borderWidth: 1,
        backgroundColor: bg,
        markingsLineWidth: 1,
        markings: function (axes) {
          var markings = [];
          for (var x = Math.floor(axes.yaxis.min);
            x < axes.yaxis.max;
            x += Math.abs(axes.yaxis.max - axes.yaxis.min) / self.markingCount) {

            markings.push({ yaxis: { from: x, to: x }, color: "#E8E8E8" });
          }
          return markings;
          }

      },
      legend: {
        container: self.legend,
        noColumns: 1,
      },
    };

  self.Prm = new Param(self.flightId,
      self.startFrame, self.endFrame,
      self.apParams, self.bpParams, true);

  var lineWidth = self.placeholder.data('linewidth');

  $.when(self.Prm.ReceiveParams(lineWidth)).then(
    function(status) {
      self.loadingBox.fadeOut();
      self.plot = $.plot(self.placeholder, self.Prm.data, self.plotOptions);

      //distribute y axes
      self.plotYaxArr = self.plot.getYAxes();
      self.plotAxes = self.plot.getAxes();
      self.plotDataset = self.plot.getData();

      self.AxesWrk = new AxesWorker(self.stepLength, self.startCopyTime, self.plotAxes);

      self.AxesWrk.LoadDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);

      self.Exc = new Exception(self.flightId,
          self.apParams, self.bpParams, self.Prm.refParamArr,
          self.Prm.associativeParamsArr, self.placeholder, self.chartContent,
          self.plotDataset, self.plotAxes.xaxis, self.plotYaxArr);

      self.Exc.ReceiveExcepions();
      self.Exc.UpdateExcSupportTools();

      self.Legnd = new Legend(self.flightId, self.legend,
          self.apParams, self.bpParams, self.Prm.associativeParamsArr,
          self.plotAxes.xaxis, self.plotYaxArr,
          self. plotDataset, self.placeholder,
          self.chartContent);
      //receive legend titles
      self.Legnd.ReceiveLegend();

      self.SupportPlotEvents();
      self.SupportLegendEvents();
      if(!self.keybordEventsSupported){
        self.keybordEventsSupported = self.SupportKeyBoardEvents();
      }

      self.plot.draw();
      self.plot.pan(0);
    },
    function(status) {
      console.log(status);
    },
    function(status) {
      console.log(status);
    }
  );
}

Chart.prototype.SupportPlotEvents = function(e) {
  //=============================================================

  //=============================================================
  //highlighting clicked item and save it in clickedItem
  var self = this;

  self.placeholder.on('plotclick', function (event, pos, item) {
    if(item){
      self.clicked = !self.clicked;
      if(self.clicked) {
        self.clickedItem = item;
        self.clickedItem.series.lines.lineWidth = self.clickedItem.series.lines.lineWidth + 2;
        self.plot.draw();
      } else {
        self.clickedItem.series.lines.lineWidth = self.clickedItem.series.lines.lineWidth - 2;
        self.plot.draw();
      }
    }
  });
  //=============================================================

  //=============================================================
  //scaling chart and moving it up and down
  var prevPos = null;
  self.placeholder.on('plothover', function (event, pos, item) {
    //label
    if (!self.Legnd.updateLegendTimeout) {
      if(!self.Legnd.crosshairLocked) {
        self.Legnd.updateLegendTimeout =
          setTimeout(function() {
            var values = self.Prm.GetValue(self.plotDataset, pos.x);
            var binaries = self.Prm.GetBinaries(self.plotDataset, pos.x);
            self.Legnd.UpdateLegend(pos.x, values, binaries);
          }, 200);
      } else {
        self.Legnd.updateLegendTimeout =
          setTimeout(function() {
            var values = self.Prm.GetValue(self.plotDataset, self.Legnd.vizirFreezePos.x);
            var binaries = self.Prm.GetBinaries(self.plotDataset, self.Legnd.vizirFreezePos.x);
            self.Legnd.UpdateLegend(self.Legnd.vizirFreezePos.x, values, binaries);
          }, 200);
      }
    }

    if(self.clicked){
      //listenning for ctrl pressed
      var y = "y" + self.clickedItem.series.yaxis.n;
      if(!self.ctrlPressed){
        self.clickedItem.series.yaxis.max -= pos[y] -
          self.clickedItem.datapoint[1];
        self.clickedItem.series.yaxis.min -= pos[y] -
          self.clickedItem.datapoint[1];
        self.plot.pan(0);

        //save distribution
        setTimeout(function(){
          self.AxesWrk.SaveDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);
        }, 500);

      } else {
        //this check for prevent jump out
        if(self.clickedItem.datapoint[1] > self.clickedItem.series.yaxis.min && self.clickedItem.datapoint[1] < self.clickedItem.series.yaxis.max) {
          self.clickedItem.series.yaxis.max -= pos[y] -
            self.clickedItem.datapoint[1];
          self.clickedItem.series.yaxis.min += pos[y] -
            self.clickedItem.datapoint[1];
        }
        self.plot.pan(0);

        //save distribution
        setTimeout(function(){
          self.AxesWrk.SaveDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);
        }, 500);
      };
    } else {
      if(item != null){
        self.Legnd.HighlightLegend(item.seriesIndex);
        //console.log(item);
      } else {
        //to hide all highlight
        self.Legnd.HighlightLegend(-1);
      }
    }

    if(self.horLineSetting){
      self.Legnd.SuportHorizontAfterCreation();
    }

    //show current time
    self.Legnd.pos = pos;
    self.Legnd.ShowVisirTime();

    if(item){
      self.Legnd.leadParamValBox.css('display', 'block');
      var label = item.series.label.split('='),
        val = item.datapoint[1];
        label = label[0].trim();
        self.Legnd.ShowLeadParamVal(val, label);
    } else {
      self.Legnd.leadParamValBox.css('display', 'none');
    }

    if(self.Legnd.displayNeed){
      self.Legnd.ShowSeriesNames();
    }

  });
  //=============================================================

  //=============================================================
  //function returns true when ctrl pressed and false after it up
  self.placeholder.on("plotpan", function (event, currPlot) {
    self.Legnd.legendTitlesNotSet = true;

    self.Exc.UpdateExcSupportTools();
    self.Legnd.UpdateBarContainersPos();

    if (self.Legnd.showSeriesLabelsNeed){
      self.Legnd.ShowSeriesLabels();
    }

    self.dispatchIntervalChange();
  });

  self.placeholder.on("plotzoom", function (event, currPlot) {
    self.Legnd.legendTitlesNotSet = true;
    self.Exc.UpdateExcSupportTools();
    self.Legnd.UpdateBarContainersPos();

    if (self.Legnd.showSeriesLabelsNeed) {
      self.Legnd.ShowSeriesLabels();
    }

    self.dispatchIntervalChange();
  });
}

Chart.prototype.dispatchIntervalChange = function () {
  var self = this;
  var currXmin = self.plotAxes.xaxis.min / 1000, // to unix timestamp
    currXmax = self.plotAxes.xaxis.max / 1000;

  self.store.dispatch(transmit(
    'CHANGE_SELECTED_START_FRAME',
     Math.min (self.endFrame,
       Math.max (0,
         Math.round((currXmin - self.startCopyTime) / self.stepLength)
       )
     )
  ));

  self.store.dispatch(transmit(
    'CHANGE_SELECTED_END_FRAME',
     Math.min (self.endFrame,
       Math.max (0,
         Math.floor((currXmax - self.startCopyTime) / self.stepLength)
       )
     )
  ));
}
//=============================================================

//=============================================================
Chart.prototype.SupportLegendEvents = function(e) {
  var self = this;

  //var loopCount = 0,
  //looping = false;
  self.legend.on("mouseover", function(e){
    var el = $(e.target);
    if(el.attr('class') == 'legendLabel'){
      var labelText = el.text().substring(),
        seriesLabel = labelText.substring(0, labelText.indexOf('=') - 2),
        seriesLabelHovered = seriesLabel,
        series = self.plot.getData();
      for(var i = 0; i < series.length; i++){
        labelText = series[i].label;
        seriesLabel = labelText.substring(0, labelText.indexOf('=') - 1);
        if(seriesLabelHovered == seriesLabel){
          //looping = true;
          //transition(series[i], plot);
          series[i].shadowSize += 2;
          series[i].lines.lineWidth += 2;

          self.plot.draw();
          break;
        }
      }
    }
  });

  //=============================================================

  //=============================================================

  self.legend.on("mouseout", function(e){
    var el = $(e.target);
    if(el.attr('class') == 'legendLabel'){
      var labelText = el.text().substring(),
        seriesLabel = labelText.substring(0, labelText.indexOf('=') - 2),
        seriesLabelHovered = seriesLabel,
        series = self.plot.getData();
      for(var i = 0; i < series.length; i++){
        labelText = series[i].label;
        seriesLabel = labelText.substring(0, labelText.indexOf('=') - 1);
        if(seriesLabelHovered == seriesLabel){
          //looping = false;
          series[i].shadowSize -= 2;
          series[i].lines.lineWidth -= 2;
          self.plot.draw();
          break;
        }
      }
    }
  });
}

//=============================================================

//=============================================================
Chart.prototype.SupportKeyBoardEvents = function(e) {
  var self = this;

  var KEY_V = 86, //vertical vizir
    KEY_H = 72, //horizontal line
    KEY_N = 78, //names params
    KEY_T = 84, //table
    KEY_M = 77, //map
    KEY_G = 71, //google earth
    KEY_S = 83, //simulator
    KEY_D = 68, //distribute
    KEY_F = 70, //freze vizir
    KEY_E = 69, //exactly (rebuild params with exact current segment)
    KEY_I = 73, //info
    KEY_L = 76, //labels
    KEY_C = 67, //codes
    KEY_ARROW_LEFT = 37, //pan left
    KEY_ARROW_RIGHT = 39,  //pan right
    KEY_ARROW_UP = 38, //pan up
    KEY_ARROW_DOWN = 40,  //pan down
    KEY_PLUS = 107,  //add one more marking line
    KEY_MINUS = 109,  //remove one marking line
    SHIFT = 16,
    CTRL = 17;

  //build bar
  $(document).keyup(function(event) {
    if(self.Legnd.verticalTextInput) {
      var yAxArr = self.plot.getYAxes();
      for(var i = 0; i < yAxArr.length; i++){
        yAxArr[i].options.zoomRange = [0,0];
      }
      self.plot.getXAxes()[0].options.zoomRange = null;
      self.shiftPressed = false;

      return false;
    }

    if(!self.mouseInChat) {
      return;
    }

    if (event.which == KEY_V) {
      if(self.shiftPressed) {
        self.Legnd.AppendSectionBar(self.Legnd.pos.x, true);
        self.Legnd.UpdateBarContainersPos();
      } else {
        self.Legnd.AppendSectionBar();
        self.Legnd.UpdateBarContainersPos();
      }
    }
    //build bar whith names
    if(event.which == KEY_N) {
      if(!self.Legnd.crosshairLocked) {
        self.Legnd.displayNeed = !self.Legnd.displayNeed;
        self.Legnd.ShowSeriesNames();
      }
    }
    //put series labels
    if(event.which == KEY_L) {
      self.Legnd.showSeriesLabelsNeed = !self.Legnd.showSeriesLabelsNeed;
      self.Legnd.seriesLabelsValues = self.Prm.GetValue(self.plotDataset, self.Legnd.pos.x);
      self.Legnd.seriesLabelsTime = self.Legnd.pos.x;
      self.Legnd.ShowSeriesLabels();
    }
    //add chart comment
    if(event.which == KEY_C) {
      self.Legnd.addComment(self.Legnd.pos.x, self.Legnd.pos.y);
    }
    //distribute
    if(event.which == KEY_D){
      var series = self.plotDataset;
      if(self.shiftPressed){
        self.AxesWrk.DistributeByBinary(self.plotYaxArr, self.plotAxes, series, self.apParams.length);
        self.plot.draw();
        self.plot.pan(0);

        //save distribution
        self.AxesWrk.SaveDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);
      } else {
        self.AxesWrk.distributeByBinaryCoef = 1;
        self.AxesWrk.Distribute(self.plotYaxArr, self.plotAxes, series, self.apParams.length);
        self.plot.draw();
        self.plot.pan(0);

        //save distribution
        self.AxesWrk.SaveDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);
      }
    }

    //freeze vizir
    if(event.which == KEY_F){
      if(self.Legnd.crosshairLocked) {
        self.Legnd.RemoveSectionBar($(self.Legnd.vizirBarContainer));
        self.plot.unlockCrosshair();
        self.Legnd.crosshairLocked = !self.Legnd.crosshairLocked;
      } else {
        self.Legnd.vizirFreezePos = self.Legnd.pos;
        self.Legnd.vLineColor = "rgba(170, 0, 0, 0.80)";
        self.Legnd.vizirBarContainer = self.Legnd.AppendSectionBar().barMainContainer;
        self.Legnd.vLineColor = 'darkgrey';
        self.Legnd.UpdateBarContainersPos();
        self.plot.lockCrosshair(1);
        self.Legnd.crosshairLocked = !self.Legnd.crosshairLocked;
        self.Legnd.displayNeed = false;
        self.Legnd.ShowSeriesNames();
      }
    }

    //exact param by curr startFrame and endFrame
    if(event.which == KEY_E){
      var currXmin = self.plotAxes.xaxis.min / 1000, // to unix timestamp
        currXmax = self.plotAxes.xaxis.max / 1000;

      self.Prm.startFrame = Math.round((currXmin - self.startCopyTime) / self.stepLength);
      self.Prm.endFrame = Math.floor((currXmax - self.startCopyTime) / self.stepLength);

      self.AxesWrk.SaveDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);

      var lineWidth = self.placeholder.data('linewidth');

      $.when(self.Prm.ReceiveParams(lineWidth)).then(
        function(status) {
          self.plot.setData(self.Prm.data);

          self.AxesWrk.LoadDistribution(self.plotYaxArr, self.apParams, self.bpParams, self.flightId, self.templateId);

          self.plot.draw();
          self.plot.pan(0);

          self.Legnd.axes = self.plot.getAxes();
          self.plotDataset = self.plot.getData();
          self.Legnd.dataset = self.plotDataset;

          self.Legnd.UpdateBarContainersPos();
          self.Exc.UpdateExcSupportTools();
        },
        function(status) {
          console.log(status);
        },
        function(status) {
          console.log(status);
        }
      );
    }

    //build horizontal line
    if(event.which == KEY_H){
      if(self.clicked){
        self.Legnd.CreateHorizont(self.clickedItem.seriesIndex);

        self.clicked = !self.clicked;
        self.clickedItem.series.lines.lineWidth = self.clickedItem.series.lines.lineWidth - 2;
        self.plot.draw();
        self.horLineSetting = !self.horLineSetting;
      }else {
        if(self.horLineSetting){
          self.horLineSetting = !self.horLineSetting;
        }
      }
    }

    if (event.which == CTRL){
      self.ctrlPressed = false;
    }

    if (event.which == SHIFT) {
      self.shiftPressed = false;
      var yAxArr = self.plot.getYAxes();
      for (var i = 0; i < yAxArr.length; i++){
        yAxArr[i].options.zoomRange = false;
      }
      self.plot.getXAxes()[0].options.zoomRange = null;
    }

    //add one more marking line
    if(event.which == KEY_PLUS){
      self.markingCount++;
      self.plot.draw();
    }

    //remove one marking line
    if(event.which == KEY_MINUS){
      if(self.markingCount > 1){
        self.markingCount--;
        self.plot.draw();
      }
    }
  });
  var moveVerticalTimeout = true;
  $(document).keydown(function(event) {
    if(event.which == KEY_ARROW_LEFT){
      if(self.shiftPressed) {
        if(moveVerticalTimeout && !self.Legnd.crosshairLocked) {
          moveVerticalTimeout = false;
          var movedPosX = self.Legnd.lastMovedPosX - 1000;
          var values = self.Prm.GetValue(self.plotDataset, movedPosX);
          var binaries = self.Prm.GetBinaries(self.plotDataset, movedPosX);
          self.Legnd.UpdateLegend(movedPosX, values, binaries);

          self.Legnd.MoveLastVertical(movedPosX, values, binaries);
          setTimeout(function() {
            moveVerticalTimeout = true;
          }, 200);
        }
      } else {
        var delta = (self.plotAxes.xaxis.max - self.plotAxes.xaxis.min) / 500;// 0.5 percent
        self.plotAxes.xaxis.max += delta;
        self.plotAxes.xaxis.min += delta;
        self.plot.draw();
        self.plot.pan(0);
      }
    }
    if(event.which == KEY_ARROW_RIGHT){
      if(self.shiftPressed) {
        if(moveVerticalTimeout && !self.Legnd.crosshairLocked) {
          moveVerticalTimeout = false;
          var movedPosX = self.Legnd.lastMovedPosX + 1000;
          var values = self.Prm.GetValue(self.plotDataset, movedPosX);
          var binaries = self.Prm.GetBinaries(self.plotDataset, movedPosX);
          self.Legnd.UpdateLegend(movedPosX, values, binaries);

          self.Legnd.MoveLastVertical(movedPosX, values, binaries);
          setTimeout(function() {
            moveVerticalTimeout = true;
          }, 200);
        }
      } else {
        var delta = (self.plotAxes.xaxis.max - self.plotAxes.xaxis.min) / 500;
        self.plotAxes.xaxis.max -= delta;
        self.plotAxes.xaxis.min -= delta;
        self.plot.draw();
        self.plot.pan(0);
      }
    }

    if (event.which == KEY_ARROW_UP){
      event.stopPropagation();
      event.preventDefault();

      for(var i = 0; i < self.plotYaxArr.length; i++){
        var delta = (self.plotYaxArr[i].max - self.plotYaxArr[i].min) / 100; // one percent

        self.plotYaxArr[i].max += delta;
        self.plotYaxArr[i].min += delta;
      }

      self.plot.draw();
      self.plot.pan(0);
    }

    if(event.which == KEY_ARROW_DOWN){
      for(var i = 0; i < self.plotYaxArr.length; i++){
        var delta = (self.plotYaxArr[i].max - self.plotYaxArr[i].min) / 100;

        self.plotYaxArr[i].max -= delta;
        self.plotYaxArr[i].min -= delta;
      }

      self.plot.draw();
      self.plot.pan(0);
    }

    if(event.which == CTRL) {
      self.ctrlPressed = true;
    }

    if(event.which == SHIFT) {
      self.shiftPressed = true;
      var yAxArr = self.plot.getYAxes();
      for(var i = 0; i < yAxArr.length; i++){
        yAxArr[i].options.zoomRange = null;
      }
      self.plot.getXAxes()[0].options.zoomRange = false;
    }

  });

  return true;
}

export default Chart;
