import { initiateGroup } from './../group/Group.test.js';

describe('Peer', () => {
  it('should promisify a message reply', done => {

    initiateGroup((peer1, peer2) => {
      peer2.group.addModule('foo', {
        bar: () => {
          return 'bar'
        }
      })

      peer1.sendMessageAndPromisifyReply({
        method: 'bar',
        module: 'foo'
      }).then(message => {
        if (message.result === 'bar') done();
      });
    });

  });
});