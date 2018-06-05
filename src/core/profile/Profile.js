export class Profile {
  constructor(group) {
    this.group = group;
    group.addModule('profile', this);
  }
}