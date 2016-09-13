class Peer {
  constructor (peerId, configuration, bus) {
    this.id = peerId;
    this.bus = bus;
  }

  getId () {
    return this.id;
  }

  sendSystemMessage () {

  }
}

export default Peer;
