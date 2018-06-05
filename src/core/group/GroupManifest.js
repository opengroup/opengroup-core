export class GroupManifest {
  constructor(data) {
    Object.assign(this, data);
    this.validate();
  }

  validate() {
    if (!this.name) throw 'A group manifest MUST contain a name';
  }
}

export class GroupManifestModule {
  constructor(group) {
    this.group = group;
    group.addModule('group-manifest', this);
    this.allowedMethodsToReturnToOtherPeers = ['getManifest'];

    this.group.on('peer-add', (peer) => {
      if (!this.group.manifest) {
        peer.sendMessageAndPromisifyReply({
          method: 'getManifest',
          module: 'group-manifest'
        }).then(groupManifestReply => {
          if (groupManifestReply.result) {
            this.group.manifest = new GroupManifest(groupManifestReply.result);
          }
        })
      }
    });
  }

  getManifest() {
    if (this.group.manifest) {
      return this.group.manifest;
    }
  }
}