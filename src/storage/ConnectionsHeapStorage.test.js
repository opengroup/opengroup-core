import {ConnectionsHeapStorage} from './ConnectionsHeapStorage.js';
import {EasyP2P} from './../connection/EasyP2P.js';

describe('ConnectionsHeapStorage', () => {
    it('should return data', done => {

        let storage1 = new ConnectionsHeapStorage();
        let storage2 = new ConnectionsHeapStorage();

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
                storage2.addConnection(connection2);
                connection2.addModule('storage', storage2);
                storage2.setItem('Hello', 'World');
            })

        }).on('started', () => {
            storage1.addConnection(connection1);
            connection1.addModule('storage', storage1);

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