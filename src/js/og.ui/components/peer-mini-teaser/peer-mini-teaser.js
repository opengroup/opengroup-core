import template from './peer-mini-teaser.html!text';
import {View, Component, Inject} from '../../ng-decorators.js';

@Component({
  selector: 'peer-mini-teaser',
  bindings: {
    peer: '<'
  }
})
@View({
  template: template
})
@Inject('$state', '$scope')

class PeerMiniTeaser {
  constructor($state, $scope) {
    this.router = $state;
    // TODO, this does not feel good.
    this.peer = $scope.$parent.peer;
    this.identity = this.peer.identity;
  }
}

export default PeerMiniTeaser;