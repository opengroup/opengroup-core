import { Group } from './Group.js';
import { initiateGroup } from './../group/Group.js';

describe('Group', () => {
  it('should connect', done => {
    initiateGroup((peer1, peer2) => {
      done();
    });
  });
});