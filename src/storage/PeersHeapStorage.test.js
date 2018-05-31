import {PeersHeapStorage} from './PeersHeapStorage.js';
import {EasyP2P} from './../connection/EasyP2P.js';
import {Peer} from '../peer/Peer.js';

describe('PeersHeapStorage', () => {
    it('should return data', done => {

        let storage1 = new PeersHeapStorage();
        let storage2 = new PeersHeapStorage();

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
                storage2.addPeer(peer2);
                storage2.setItem('Hello', 'World');
            })

        }).on('started', () => {
            let peer1 = new Peer(connection1);
            storage1.addPeer(peer1);

            storage1.getExternalItems('Hello').forEach(requestToExternalStorage => {
                requestToExternalStorage.then(response => {
                    if (response.result === 'World') {
                        done();
                    }
                });
            });
        
        });
    });

});