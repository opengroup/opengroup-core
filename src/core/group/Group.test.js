import { Group, initiateGroup } from './Group.js';
import { GroupManifest } from './GroupManifest.js';

describe('Group', () => {
  it('should connect', done => {
    initiateGroup((peer1, peer2) => {
      done();
    });
  });

  it('should broadcast', done => {
    initiateGroup((peer1, peer2) => {

      peer2.group.on('message', message => {
        if (message.message === 'Hello to the world') done();
      });

      peer1.group.broadcast({
        message: 'Hello to the world'
      })
    });
  });
});

describe('Group', () => {
  it('should load the profile module', done => {
    let manifest = new GroupManifest({
      name: 'Lorem ipsum',
      modules: {
        './../profile/Profile.js:Profile': {}
      }
    });

    let group = new Group(manifest);
    group.on('loaded', () => {
      if (group.modules.profile) done();
    });
  });
});