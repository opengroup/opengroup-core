import Peer from './og.core/Peer';

var peer1 = new Peer();
var peer2 = new Peer();

peer1.getOffer(function (offer) {
  peer2.getAnswer(offer, function (answer) {
    peer1.acceptAnswer(answer, function () {
      console.log(peer1.id)
      console.log(peer2.id)
    });
  });
});
