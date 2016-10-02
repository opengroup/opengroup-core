import template from './peers-list.html!text';
import {View, Component, Inject} from '../../ng-decorators.js';

@Component({
  selector: 'peers-list'
})
@View({
  template: template
})
@Inject('$state', 'GroupService', '$rootScope')

class PeersList {
  constructor($state, GroupService, $rootScope) {
    this.router = $state;
    this.peerService = GroupService.get().getService('peer');
    this.scope = $rootScope;

    this.peerService.getAllAsStream((peers) => {
      this.scope.$applyAsync(() => {
        this.peers = peers;
      });
    });
  }
}

export default PeersList;