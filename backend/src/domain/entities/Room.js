export class Room {
  constructor({ id, code, creatorName, users = [], state = 'waiting', createdAt = new Date() }) {
    this.id = id;
    this.code = code;
    this.creatorName = creatorName;
    this.users = users;
    this.state = state;         // 'waiting' | 'live' | 'closed'
    this.createdAt = createdAt;
    this.sharingUser = null;
    this.userColors = {};       // userName → color hex
  }

  setUserColor(userName, color) {
    if (color) this.userColors[userName] = color;
  }

  addUser(userName) {
    if (!this.users.includes(userName)) this.users.push(userName);
  }

  removeUser(userName) {
    this.users = this.users.filter(u => u !== userName);
    if (this.sharingUser === userName) this.sharingUser = null;
  }

  startSharing(userName) {
    this.sharingUser = userName;
    this.state = 'live';
  }

  stopSharing() {
    this.sharingUser = null;
    this.state = 'waiting';
  }

  close() {
    this.state = 'closed';
  }

  isEmpty() {
    return this.users.length === 0;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      creatorName: this.creatorName,
      users: this.users,
      state: this.state,
      sharingUser: this.sharingUser,
      createdAt: this.createdAt,
      userColors: { ...this.userColors },
    };
  }
}
