import {Run, Inject} from '../ng-decorators.js';
import $ from 'jquery';

class Init {
  @Run()
  @Inject('$rootScope', 'GroupService', '$state')

  static runFactory($rootScope, GroupService, $state){
    var peerService = GroupService.get().getService('peer');
    var identity = peerService.getIdentity();

    $rootScope.$on('$viewContentLoaded', function () {
      $('body').attr('data-state', $state.current.name.replace(/\./g, '-'))

      setTimeout(function () {
        $('body').removeClass('no-transitions');
      }, 200);
    });

    $rootScope.$on('$stateChangeStart', function () {
      $('body').addClass('no-transitions');
    });

    if (identity) {
      $state.go('chat');
    } else {
      $state.go('set-name');
    }
  }
}

export default Init;
