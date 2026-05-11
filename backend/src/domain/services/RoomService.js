import { Room } from '../entities/Room.js';
import { randomBytes } from 'node:crypto';
import { randomUUID } from 'node:crypto';

export class RoomService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  generateCode() {
    return randomBytes(3).toString('hex').toUpperCase(); // 6-char hex: e.g. "A3F12C"
  }

  async createRoom(creatorName) {
    const code = this.generateCode();
    const room = new Room({
      id: randomUUID(),
      code,
      creatorName,
      users: [creatorName],
      state: 'waiting',
    });
    await this.roomRepository.save(room);
    return room;
  }

  async joinRoom(code, userName, userColor = null) {
    const room = await this.roomRepository.findByCode(code);
    if (!room) throw new Error('Sala no encontrada');
    if (room.state === 'closed') throw new Error('La sala ya fue cerrada');
    if (room.users.length >= 3) throw new Error('La sala está llena (máx. 3 usuarios)');
    room.addUser(userName);
    room.setUserColor(userName, userColor);
    await this.roomRepository.save(room);
    return room;
  }

  async leaveRoom(code, userName) {
    const room = await this.roomRepository.findByCode(code);
    if (!room) return null;
    room.removeUser(userName);
    if (room.isEmpty()) {
      room.close();
    }
    await this.roomRepository.save(room);
    return room;
  }

  async startSharing(code, userName) {
    const room = await this.roomRepository.findByCode(code);
    if (!room) throw new Error('Sala no encontrada');
    room.startSharing(userName);
    await this.roomRepository.save(room);
    return room;
  }

  async stopSharing(code) {
    const room = await this.roomRepository.findByCode(code);
    if (!room) throw new Error('Sala no encontrada');
    room.stopSharing();
    await this.roomRepository.save(room);
    return room;
  }
}
