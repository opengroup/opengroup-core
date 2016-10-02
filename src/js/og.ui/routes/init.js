import {Run, Inject} from '../ng-decorators.js';

class Init {
  @Run()
  @Inject('$rootScope', 'GroupService', '$state')

  static runFactory($rootScope, GroupService, $state){
    var peerService = GroupService.get().getService('peer');
    var identity = peerService.getIdentity();

    if (identity) {
      $state.go('chat');
    } else {
      $state.go('set-name');
    }
  }
}

export default Init;