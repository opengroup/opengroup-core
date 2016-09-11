'use strict';

import Peer from 'src/js/og.core/Peer';

var peer1 = new Peer();
var peer1Offer;
var peer2 = new Peer();
var peer2Answer;

describe('Peer', () => {
  it('should create an offer', (done) => {
    peer1.getOffer(function (offer) {
      if (offer && offer.type) {
        expect(offer.type).to.equal('offer');
        peer1Offer = offer;
        done();
      }
    });
  });

  it('should create an answer from an offer', (done) => {
    peer2.getAnswer(peer1Offer, function (answer) {
      if (answer && answer.type) {
        expect(answer.type).to.equal('answer');
        peer2Answer = answer;
        done();
      }
    });
  });

  it('should run a callback when a connection is created', (done) => {
    peer1.acceptAnswer(peer2Answer, function () {
      done();
    });
  });
});

