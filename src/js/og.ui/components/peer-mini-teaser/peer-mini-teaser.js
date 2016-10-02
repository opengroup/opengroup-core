import template from './peer-mini-teaser.html!text';
import {View, Component, Inject} from '../../ng-decorators.js';

@Component({
  selector: 'peer-mini-teaser'
})
@View({
  template: template
})
@Inject('$state')

class PeerMiniTeaser {
  constructor($state) {
    this.router = $state;
  }
}

export default PeerMiniTeaser;