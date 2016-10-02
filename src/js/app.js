import Group from './og.core/group/Group.js';
import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';

import './og.ui/components/components.js';
import ngDecorators from './og.ui/ng-decorators.js';

angular.element(document).ready(function() {
  angular.bootstrap(document, [ngDecorators.name], {
    strictDi: true
  });
});