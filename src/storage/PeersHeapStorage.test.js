import { PeersHeapStorage } from './PeersHeapStorage.js';
import { initiateGroup } from './../group/Group.test.js';

describe('PeersHeapStorage', () => {
  it('should return data', done => {
    let storage1 = new PeersHeapStorage();
    let storage2 = new PeersHeapStorage();

    initiateGroup((peer1, peer2) => {
      peer1.group.addModule('storage', storage1);
      peer2.group.addModule('storage', storage2);

      storage2.setItem('Hello', 'World');

      storage1.getExternalItems('Hello').forEach(requestToExternalStorage => {
        requestToExternalStorage.then(response => {
          console.log(response)
          if (response.result === 'World') {
            done();
          }
        });
      });
    });
  });
});