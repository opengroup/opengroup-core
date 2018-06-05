import { GroupManifestModule, GroupManifest } from './GroupManifest.js';
import { initiateGroup, Group } from './../group/Group.js';

describe('Group', () => {
  it('should send over the groupManifest', done => {
    let manifest = new GroupManifest({
      name: 'Lorem ipsum'
    });

    initiateGroup((peer1, peer2) => {
      new GroupManifestModule(peer1.group);
      new GroupManifestModule(peer2.group);

      peer2.group.on('manifest-set', () => {
        done();
      });

    }, manifest);
  });
});


describe('Group', () => {
  it('should consume groupManifest', done => {
    let manifest = new GroupManifest({
      name: 'Lorem ipsum',
      modules: {
        './../profile/Profile.js:Profile': {}
      }
    });

    let group = new Group(manifest);
    group.on('loaded', done);
  });
});