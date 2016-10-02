import template from './add-peer.html!text';
import {RouteConfig, Component, View, Inject} from '../../ng-decorators.js';
import Clipboard from 'clipboard';

@RouteConfig('add-peer', {
  url: '/add-peer',
  template: '<add-peer></add-peer>'
})
@Component({
  selector: 'add-peer'
})
@View({
  template: template
})
@Inject('$state', 'GroupService', '$rootScope')

class AddPeer {
  constructor($state, GroupService, $rootScope) {
    this.router = $state;
    this.scope = $rootScope;
    this.group = GroupService.get();

    var setInitialScope = () => {
      this.role = '';
      this.initiator = { offer: '', done: false, copied: false };
      this.answerer = { answer: '', done: false, copied: false };
    };

    this.clipboard = new Clipboard('.clipboard');

    this.clipboard.on('success', (e) => {
      if (e.trigger.id == 'initiator-copy-offer') {
        this.offerCopied();
      }

      if (e.trigger.id == 'answerer-copy-answer') {
        this.answerCopied();
      }

      e.clearSelection();
    });

    this.group.connectionBus.once('newConnection', () => {
      this.scope.$applyAsync(() => {
        setInitialScope();
        this.router.go('chat');
      });
    });

    setInitialScope();
  }

  // Initiator start.
  initiatorInit () {
    if (!this.initiator.offer) {
      this.group.connectionBus.add({
        type: 'OgEasyWebRtc',
        config: {
          signaler: {
            type: 'OgEasyWebRtcSignalerManuel',
            config: {
              role: 'initiator',
              events: [['createdOffer', (data) => { this.initiatorCreatedOffer(data) } ]]
            }
          }
        }
      });
    }
  }

  initiatorCreatedOffer (data) {
    this.scope.$applyAsync(() => {
      this.initiator.answerCallback = data.callback;
      this.initiator.offer = btoa(JSON.stringify(data.offer.toJSON()));
    });
  }

  offerCopied () {
    this.initiator.copied = true
  }

  answerPasted () {
    var answer = JSON.parse(atob(this.initiator.answer));
    this.initiator.answerCallback(answer);
    this.initiator.done = true;
  }
  // Initiator end.

  // Answerer start.
  answererInit () {
    if (!this.answerer.answer) {
      var offer = JSON.parse(atob(this.answerer.offer));
      this.group.connectionBus.add({
        type: 'OgEasyWebRtc',
        config: {
          signaler: {
            type: 'OgEasyWebRtcSignalerManuel',
            config: {
              role: 'answerer',
              offer: offer,
              events: [['createdAnswer', (data) => { this.answererCreatedAnswer(data) } ]]
            }
          }
        }
      });
    }
  }

  answererCreatedAnswer(data) {
    this.scope.$applyAsync(() => {
      this.answerer.answer = btoa(JSON.stringify(data.answer.toJSON()));
    });
  }

  answerCopied () {
    this.answerer.copied = true;
  }
  // Answerer stop.

}

export default AddPeer;