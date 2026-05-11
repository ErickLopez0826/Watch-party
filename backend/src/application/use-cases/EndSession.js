export class EndSession {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  async execute(sessionId, { title, type, chapters, stopAt, rating, notes }) {
    if (!title || title.trim().length === 0) throw new Error('El título es obligatorio');
    if (title.length > 100) throw new Error('El título no puede superar 100 caracteres');
    if (!['serie', 'pelicula'].includes(type)) throw new Error('Tipo inválido');
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error('El rating debe ser un número entero entre 1 y 5');
    }
    return this.sessionService.finishSession(sessionId, {
      title: title.trim(),
      type,
      chapters: chapters?.trim() || null,
      stopAt: stopAt?.trim() || null,
      rating,
      notes: notes?.trim() || null,
    });
  }
}
