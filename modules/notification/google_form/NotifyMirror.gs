/* on form submit trigger */
function sendNotification() {
  Logger.log("sendNotification() called");
  var responses = FormApp.getActiveForm().getResponses();
  var lenResponses = responses.length;
  if (lenResponses <= 0) {
    Logger.log("no response sent due to non-positive length");
  } else {
    var latestResponse = responses[lenResponses - 1];
    var resTimestamp = latestResponse.getTimestamp();
    var resDate = Utilities.formatDate(resTimestamp, "GMT+8", "dd/MMM/yyyy HH:mm");
    var resText = latestResponse.getItemResponses()[0].getResponse();
    Logger.log('Last response was "%s" at timestamp "%s"', resText, resDate);
    requestMirror(resDate, resText);
  }
}

function requestMirror(date, message) {
    var data = {
      'date': date,
      'text': message
    };
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };
    var mirrorResponse = UrlFetchApp.fetch('http://kagamirror.serveo.net:80/showNotification', options);
    Logger.log(mirrorResponse);
    Logger.log("end of sendNotification()");
}