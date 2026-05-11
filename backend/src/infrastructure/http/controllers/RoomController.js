import { RoomService } from '../../../domain/services/RoomService.js';
import { RoomRepository } from '../../database/repositories/RoomRepository.js';
import { CreateRoom } from '../../../application/use-cases/CreateRoom.js';
import { JoinRoom } from '../../../application/use-cases/JoinRoom.js';

export class RoomController {
  constructor(db) {
    const repo = new RoomRepository(db);
    const service = new RoomService(repo);
    this.createRoom = new CreateRoom(service);
    this.joinRoom = new JoinRoom(service);
    this.roomService = service;
  }

  async create(req, res) {
    try {
      const { userName } = req.body;
      const room = await this.createRoom.execute(userName);
      res.status(201).json(room.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async join(req, res) {
    try {
      const { code } = req.params;
      const { userName } = req.body;
      const room = await this.joinRoom.execute(code, userName);
      res.json(room.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async get(req, res) {
    try {
      const room = await this.roomService.roomRepository.findByCode(req.params.code);
      if (!room) return res.status(404).json({ error: 'Sala no encontrada' });
      res.json(room.toJSON());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
