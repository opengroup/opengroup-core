import { Group } from './Group.js';
import { Peer } from './../peer/Peer.js';
import { EasyP2P } from './../connection/EasyP2P.js';

export let initiateGroup = (callback) => {
  // The external side of the connection.
  let connection2;
  let peer2;
  let group2 = new Group();

  // The local side of the connection.
  let peer1;
  let group1 = new Group();
  let connection1 = new EasyP2P({
    role: 'initiator',
  }).on('offer-ready', offerSdp => {

    connection2 = new EasyP2P({
        role: 'answerer',
        initialOffer: offerSdp,
      })
      .on('answer-ready', answerSdp => connection1.acceptAnswer(answerSdp))
      .on('started', () => {
        peer2 = new Peer(connection2, group2);
        callback(peer1, peer2);
      })

  }).on('started', () => {
    peer1 = new Peer(connection1, group1);
  });
};