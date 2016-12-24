import EasyWebRtc from './EasyWebRtc.js';

var EasyWebRtc1 = new EasyWebRtc();
var EasyWebRtc1Offer;
var EasyWebRtc2 = new EasyWebRtc();
var EasyWebRtc2Answer;

describe('EasyWebRtc', () => {
    it('should create an offer', (done) => {
        EasyWebRtc1.getOffer((offer) => {
            if (offer && offer.type) {
                expect(offer.type).toEqual('offer');
                EasyWebRtc1Offer = offer;
                done();
            }
        });
    });

    it('should create an answer from an offer', (done) => {
        EasyWebRtc2.getAnswer(EasyWebRtc1Offer, (answer) => {
            if (answer && answer.type) {
                expect(answer.type).toEqual('answer');
                EasyWebRtc2Answer = answer;
                done();
            }
        });
    });

    it('should run a callback when a connection is created', (done) => {
        EasyWebRtc1.on('connected', () => {
            done();
        });

        EasyWebRtc1.acceptAnswer(EasyWebRtc2Answer);
    });

    it('should send a message', (done) => {
        EasyWebRtc2.once('message', (message) => {
            if (message === 'should send a message') {
                done();
            }
        });

        EasyWebRtc1.sendMessage('should send a message');
    });
});

