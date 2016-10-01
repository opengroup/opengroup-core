class Peer {
  constructor (peerId, bus) {
    this.id = peerId;
    this.bus = bus;
  }

  getId () {
    return this.id;
  }
}

export default Peer;
