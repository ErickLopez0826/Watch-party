export class JoinRoom {
  constructor(roomService) {
    this.roomService = roomService;
  }

  async execute(code, userName) {
    if (!code || code.length < 6) throw new Error('Código de sala inválido');
    if (!userName || userName.trim().length < 2) {
      throw new Error('El nombre de usuario debe tener al menos 2 caracteres');
    }
    return this.roomService.joinRoom(code.toUpperCase(), userName.trim());
  }
}
