import Group from './og.core/group/Group.js';
import rivets from 'rivets';
import $ from 'jquery';
import Clipboard from 'clipboard';

var group = new Group({
  id: 'lorem-ipsum',
  label: 'Lorem ipsum'
});

var peerService = group.connectionBus.getService('peer');
var identity = peerService.getIdentity();

var setIdentityScope = {
  name: '',
  saveIdentity: function () {
    peerService.setIdentity({
      name: setIdentityScope.name
    });

    $('body').addClass('has-identity-set');
  }
};

if (identity) {
  setIdentityScope.name = identity.name;
}

var setIdentityView = rivets.bind($('#set-identity'), setIdentityScope);

var chatScope = {
  peers: [],
  messages: []
};

peerService.getAllAsStream(function (peers) {
  chatScope.peers = peers;

  console.log(peers)
});

var chatView = rivets.bind($('#chat'), chatScope);

var addConnectionScope = {
  role: false,
  initiator: {
    init: function () {
      group.connectionBus.add({
        type: 'OgEasyWebRtc',
        config: {
          signaler: {
            type: 'OgEasyWebRtcSignalerTest',
            config: {
              role: 'initiator',
              events: [
                ['createdOffer', (data) => {
                  addConnectionScope.initiator.offer = btoa(JSON.stringify(data.offer.toJSON()));
                  addConnectionScope.initiator.answerCallback = data.callback;
                }]
              ]
            }
          }
        }
      });
    },
    acceptAnswer: function () {
      if (addConnectionScope.initiator.answer) {
        var answerConverted = JSON.parse(atob(addConnectionScope.initiator.answer));
        addConnectionScope.initiator.answerCallback(answerConverted);
      }
    },
    submit: function () {},
  },
  answerer: {
    init: function () {
      var offerConverted = JSON.parse(atob(addConnectionScope.answerer.offer));

      group.connectionBus.add({
        type: 'OgEasyWebRtc',
        config: {
          signaler: {
            type: 'OgEasyWebRtcSignalerTest',
            config: {
              role: 'answerer',
              offer: offerConverted,
              events: [
                ['createdAnswer', (data) => {
                  addConnectionScope.answerer.answer = btoa(JSON.stringify(data.answer.toJSON()));
                }]
              ]
            }
          }
        }
      });
    },
    answer: function () {

    }
  }
};

group.connectionBus.on('newConnection', function () {
  addConnectionScope.role = '';

  addConnectionScope.initiator.offer = '';
  addConnectionScope.initiator.answer = '';

  addConnectionScope.answerer.offer = '';
  addConnectionScope.answerer.answer = '';
});

var addConnectionView = rivets.bind($('#add-connection'), addConnectionScope);

new Clipboard('.copy-to-clipboard');