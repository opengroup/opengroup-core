import { EasyP2P } from './EasyP2P.js';

describe('initiatorInit', () => {
  it('should create an offer', done => {

    let connection = new EasyP2P({
      role: 'initiator',
    }).on('offer-ready', offerSdp => done());

  });
});

describe('answererInit', () => {
  it('should create an answer', done => {

    let connection1 = new EasyP2P({
      role: 'initiator',
    }).on('offer-ready', offerSdp => {

      let connection2 = new EasyP2P({
        role: 'answerer',
        initialOffer: offerSdp,
      }).on('answer-ready', answerSdp => done());

    });

  });
});

describe('Succesfull connection', () => {
  it('should connect', done => {

    let connection1 = new EasyP2P({
      role: 'initiator',
    }).on('offer-ready', offerSdp => {

      let connection2 = new EasyP2P({
        role: 'answerer',
        initialOffer: offerSdp,
      }).on('answer-ready', answerSdp => connection1.acceptAnswer(answerSdp));

    }).on('started', done);

  });
});

describe('Sending a message', () => {
  it('should connect', done => {

    let connection1 = new EasyP2P({
      role: 'initiator',
    }).on('offer-ready', offerSdp => {

      let connection2 = new EasyP2P({
          role: 'answerer',
          initialOffer: offerSdp,
        })
        .on('answer-ready', answerSdp => connection1.acceptAnswer(answerSdp))
        .on('message', message => {
          // console.log(message)
          done()
        });

    }).on('started', () => {
      connection1.sendMessage('Hello world');
    });

  });
});