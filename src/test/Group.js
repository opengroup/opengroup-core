import Group from '../js/og.core/group/Group.js';

var group = new Group({
  name: 'lorem-ipsum',
  label: 'Lorem ipsum'
});

describe('Group', () => {
  it('should have a connectionBus', (done) => {
    if (group.connectionBus) {
      done();
    }
  });
});