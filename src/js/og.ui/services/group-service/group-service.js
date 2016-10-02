import {Service, Inject} from '../../ng-decorators.js';
import Group from '../../../og.core/group/Group.js';

@Service({
  serviceName: 'GroupService'
})
@Inject()

class GroupService {
  constructor() {
    this.group = new Group({
      id: 'lorem-ipsum',
      label: 'Lorem ipsum'
    });
  }

  get () {
    return this.group;
  }
}

export default GroupService;
