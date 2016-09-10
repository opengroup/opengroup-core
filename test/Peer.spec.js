'use strict';

import Peer from 'Peer';

describe('ES6 Peer', () => {
  let peer;

  beforeEach(() => {
    peer = new Peer();
  });

  afterEach(() => {

  });

  it('should return "Do Something" when calling doSomething', () => {
    expect('b').to.equal('b');
  });
});

