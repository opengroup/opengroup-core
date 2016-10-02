import template from './peer-mini-teaser.html!text';
import {View, Component, Inject} from '../../ng-decorators.js'; // jshint unused: false

//start-non-standard
@Component({
  selector: 'peer-mini-teaser'
})
@View({
  template: template
})
@Inject('$state')
//end-non-standard
class PeerMiniTeaser {
  constructor($state) {
    this.router = $state;
  }
}

export default PeerMiniTeaser;