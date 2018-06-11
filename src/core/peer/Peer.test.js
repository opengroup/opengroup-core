import { initiateGroup } from './../group/Group.js';

describe('Peer', () => {
  it('should promisify a message reply', done => {

    initiateGroup((peer1, peer2) => {
      peer2.group.addModule('foo', {
        allowedMethodsToReturnToOtherPeers: ['bar'],
        bar: () => {
          return 'bar'
        }
      });

      peer1.sendCommandAndPromisifyResponse({
        method: 'bar',
        module: 'foo'
      }).then(message => {
        if (message.result === 'bar') done();
      });
    });

  });
});