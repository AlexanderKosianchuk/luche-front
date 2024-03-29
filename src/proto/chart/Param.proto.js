//=============================================================
//┏━━━┓
//┃┏━┓┃
//┃┗━┛┣━━┳━┳━━┳┓┏┓
//┃┏━━┫┏┓┃┏┫┏┓┃┗┛┃
//┃┃╋╋┃┏┓┃┃┃┏┓┃┃┃┃
//┗┛╋╋┗┛┗┻┛┗┛┗┻┻┻┛
//=============================================================

function Param(flightId,
  startFrame, endFrame,
  apParams, bpParams, isPrintPage){

  this.flightId = flightId;
  this.apCount = 0;
  this.bpCount = 0;
  this.paramCount = 0;
  this.apArr = apParams;
  this.bpArr = bpParams;
  this.refParamArr = new Array();
  this.associativeParamsArr = new Array();
  this.data = Array();

  this.startFrame = startFrame;
  this.endFrame = endFrame;

  this.isPrintPage = isPrintPage;

  if(this.apArr != null){
    this.apCount = this.apArr.length;
    this.refParamArr = this.refParamArr.concat(this.apArr);
    this.paramCount += this.apCount;
  }

  if(this.bpArr != null){
    this.bpCount = this.bpArr.length;
    this.refParamArr = this.refParamArr.concat(this.bpArr);
    this.paramCount += this.bpCount;
  }
};
//=============================================================

//=============================================================
Param.prototype.ReceiveParams = function(lineWidth) {
  return new Promise((resolve, reject) => {
    let promises =
      this.apArr.map((param, i) =>
        this.GetApParam(param, i, lineWidth)
      ).concat(
        this.bpArr.map((param, i) =>
          this.GetBpParam(param, i, lineWidth)
        )
      );

    Promise.all(promises).then(resolve, reject);
  });
};
//=============================================================

//=============================================================
Param.prototype.GetApParam = function(paramCode, i, lineWidth){
  var self = this,
    apDataArray = Array(),
    pV = {
      flightId: self.flightId,
      paramApCode: paramCode,
      totalSeriesCount: self.apCount,
      startFrame: self.startFrame,
      endFrame: self.endFrame,
      isPrintPage: self.isPrintPage
    };

  return new Promise((resolve, reject) => {
    $.ajax({
      data: pV,
      type: "POST",
      dataType: 'json',
      url: REST_URL+'flightData/getApParamData',
      xhrFields: { withCredentials: true },
      crossDomain: true
    }).done(function(receivedParamPoints){
      apDataArray = receivedParamPoints;

      $.ajax({
        type: "POST",
        data: {
          flightId: self.flightId,
          code: paramCode
        },
        dataType: 'json',
        url: REST_URL+'fdr/getParamInfo',
        xhrFields: { withCredentials: true },
        crossDomain: true
      }).done(function(receivedInfo){
        var color = receivedInfo['color'],
          nm = receivedInfo['name'];
        var apDataFlotSeries = {
            data: apDataArray,
            label: paramCode + " " + nm + " = 0.00",
            yaxis: i + 1,
            color: "#" + color,
            shadowSize: 0,
            lines: { lineWidth: lineWidth, show: true }
          };
        self.data[i] = apDataFlotSeries;
        if (self.associativeParamsArr[paramCode] === undefined) {
          self.associativeParamsArr[paramCode] = [i, color];
        }

        resolve(paramCode);
      }).fail(function(mess){
        reject(mess);
      });
    }).fail(function(mess){
      reject(mess);
    });
  });
}
//=============================================================

//=============================================================
Param.prototype.GetBpParam = function(paramCode, i, lineWidth, dfd){
  var self = this,
    bpDataArray = Array(),
    color = String();

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      data: {
        flightId: self.flightId,
        code: paramCode
      },
      dataType: 'json',
      url: REST_URL+'flightData/getBpParamData',
      xhrFields: { withCredentials: true },
      crossDomain: true
    }).done(function(receivedParamPoints){
      bpDataArray = receivedParamPoints;

      $.ajax({
        type: "POST",
        data: {
          flightId: self.flightId,
          code: paramCode
        },
        dataType: 'json',
        url: REST_URL+'fdr/getParamInfo',
        xhrFields: { withCredentials: true },
        crossDomain: true
      }).done(function(receivedInfo){
        var color = receivedInfo['color'],
          nm = receivedInfo['name'];

        var bpDataFlotSeries = {
            data: bpDataArray,
            label: paramCode + " " + nm + " = F",
            yaxis: self.apCount + i + 1,
            color: "#" + color,
            points: { symbol: "square", show: true, radius: lineWidth + 1, fillColor: "#" + color},
            shadowSize: 0,
            lines: { lineWidth: lineWidth, show: true, }
          };
        self.data[self.apCount + i] = bpDataFlotSeries;
        if (self.associativeParamsArr[paramCode] === undefined) {
          self.associativeParamsArr[paramCode] = [self.apCount + i, color];
        }

        resolve(paramCode);
      }).fail(function(mess){
        reject(mess);
      });
    }).fail(function(mess){
      reject(mess);
    });
  });
}

//=============================================================

//=============================================================
//Get value by x coord by interpolating
Param.prototype.GetValue = function(dataset, x) {
  var yArr = Array();
  let posX = 0;
  for (var i = 0; i < this.apCount; ++i) {
    var series = dataset[i];
    // Find the nearest points, x-wise
    for (var j = 0; j < series.data.length; ++j) {
      if (series.data[j][0] > x) {
        break;
      };
    }

    // Now Interpolate
    var y,
      p1 = series.data[j - 1],
      p2 = series.data[j];

    if ((p1 == null) && (p2 != null)) {
      y = Number(p2[1]);
    } else if ((p1 != null) && (p2 == null)) {
      y = Number(p1[1]);
    } else if ((p1 != null) && (p2 != null)) {
      p1[0] = Number(p1[0]);
      p1[1] = Number(p1[1]);
      p2[0] = Number(p2[0]);
      p2[1] = Number(p2[1]);
      posX = Number(x);
      y = p1[1] + (p2[1] - p1[1]) *
        (posX - p1[0]) / (p2[0] - p1[0]);
    } else {
      y = 0;
    }

    yArr.push(Number(y).toFixed(2));
  }
  return yArr;
};
//=============================================================
//Get value by x coord by interpolating
Param.prototype.GetBinaries = function(dataset, x){
  var bpPresentArray = new Array();
  for (var i = this.apCount; i < this.paramCount; ++i) {
    var series = dataset[i],
      bpPresent = false,
      notFound = true;

    // Find the nearest points, x-wise
    for (var j = 0; j < series.data.length; ++j) {
      if ((series.data[j] !== null) && (series.data[j] !== 'null')) {
        if (series.data[j][0] > x) {
          notFound = false;
          break;
        } else {
          notFound = true;
        };
      };
    }

    if ((j > 0) && (!notFound)){
      if (series.data[j - 1] != null){
        bpPresent = true;
      };
    }

    bpPresentArray.push(bpPresent);
  }

  return bpPresentArray;
};

export default Param;
