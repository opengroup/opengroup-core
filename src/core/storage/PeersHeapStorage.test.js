import { PeersHeapStorage } from './PeersHeapStorage.js';
import { initiateGroup } from './../group/Group.js';

describe('PeersHeapStorage', () => {
  it('should return data', done => {
    initiateGroup((peer1, peer2) => {
      let storage1 = new PeersHeapStorage(peer1.group);
      let storage2 = new PeersHeapStorage(peer2.group);

      storage2.setItem('Hello', 'World');

      storage1.getExternalItems('Hello').forEach(requestToExternalStorage => {
        requestToExternalStorage.then(response => {
          if (response.result === 'World') {
            done();
          }
        });
      });
    });
  });
});