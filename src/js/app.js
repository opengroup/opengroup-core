import WebRTCConnection from './og.core/WebRTCConnection';

var WebRTCConnection1 = new WebRTCConnection();
var WebRTCConnection2 = new WebRTCConnection();

WebRTCConnection1.getOffer(function (offer) {
  WebRTCConnection2.getAnswer(offer, function (answer) {
    WebRTCConnection1.acceptAnswer(answer, function () {
      console.log(WebRTCConnection1.id);
      console.log(WebRTCConnection2.id);
    });
  });
});
