import template from './add-peer.html!text';
import {RouteConfig, Component, View, Inject} from '../../ng-decorators.js';

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
@Inject()

class AddPeer {
  constructor() {

  }
}

export default AddPeer;