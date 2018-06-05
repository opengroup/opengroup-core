import { Group } from './Group.js';
import { initiateGroup } from './../group/Group.js';

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