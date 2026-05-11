export class CreateRoom {
  constructor(roomService) {
    this.roomService = roomService;
  }

  async execute(creatorName) {
    if (!creatorName || creatorName.trim().length < 2) {
      throw new Error('El nombre de usuario debe tener al menos 2 caracteres');
    }
    if (creatorName.length > 20) {
      throw new Error('El nombre de usuario no puede superar 20 caracteres');
    }
    return this.roomService.createRoom(creatorName.trim());
  }
}
