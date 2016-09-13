import WebRTCConnection from 'src/js/og.core/connection/WebRTCConnection';

var WebRTCConnection1 = new WebRTCConnection();
var WebRTCConnection1Offer;
var WebRTCConnection2 = new WebRTCConnection();
var WebRTCConnection2Answer;

describe('WebRTCConnection', () => {
  it('should create an offer', (done) => {
    WebRTCConnection1.getOffer(function (offer) {
      if (offer && offer.type) {
        expect(offer.type).to.equal('offer');
        WebRTCConnection1Offer = offer;
        done();
      }
    });
  });

  it('should not have an id after only creating an offer', () => {
    expect(WebRTCConnection1.id).to.equal(undefined);
  });

  it('should create an answer from an offer', (done) => {
    WebRTCConnection2.getAnswer(WebRTCConnection1Offer, function (answer) {
      if (answer && answer.type) {
        expect(answer.type).to.equal('answer');
        WebRTCConnection2Answer = answer;
        done();
      }
    });
  });


  it('should have an id as answerer after creating an answer', () => {
    expect(WebRTCConnection2.id).to.not.equal(undefined);
  });


  it('should run a callback when a connection is created', (done) => {
    WebRTCConnection1.acceptAnswer(WebRTCConnection2Answer, function () {
      done();
    });
  });

  it('should have an id as initiator after accepting an answer', () => {
    expect(WebRTCConnection1.id).to.not.equal(undefined);
  });

});

