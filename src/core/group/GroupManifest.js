export class GroupManifest {
  constructor(data) {
    Object.assign(this, data);
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
          this.group.manifest = new GroupManifest(groupManifestReply.result);
        })
      }
    });
  }

  getManifest() {
    if (this.group.manifest) {
      return JSON.stringify(this.group.manifest);
    }
  }
}