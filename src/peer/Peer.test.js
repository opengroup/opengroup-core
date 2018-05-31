import {EasyP2P} from './../connection/EasyP2P.js';
import {Peer} from '../peer/Peer.js';

describe('Peer', () => {
    it('should promisify a message reply', done => {

        let stubModule = {
          hello () {
            return 'world'
          }
        };

        // The external side of the connection.
        let connection2;

        // The local side of the connection.
        let connection1 = new EasyP2P({
            role: 'initiator',
        }).on('offer-ready', offerSdp => {

            connection2  = new EasyP2P({
                role: 'answerer',
                initialOffer: offerSdp,
            })
            .on('answer-ready', answerSdp => connection1.acceptAnswer(answerSdp))
            .on('started', () => {
                let peer2 = new Peer(connection2);
                peer2.addModule('stub', stubModule);
            })

        }).on('started', () => {
          let peer1 = new Peer(connection1);
          peer1.sendMessageAndPromisifyReply({
            module: 'stub',
            method: 'hello'
          }).then(message => {
            if (message.result === 'world') done();
          })
        });
    });

});