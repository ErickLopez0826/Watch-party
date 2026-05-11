export class WatchSession {
  constructor({
    id,
    roomId,
    title,
    type,           // 'serie' | 'pelicula'
    chapters,
    sharedBy,
    usersPresent,
    startedAt = new Date(),
    endedAt = null,
    durationMinutes = null,
    stopAt = null,
    rating = null,
    notes = null,
  }) {
    this.id = id;
    this.roomId = roomId;
    this.title = title;
    this.type = type;
    this.chapters = chapters;
    this.sharedBy = sharedBy;
    this.usersPresent = usersPresent;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.durationMinutes = durationMinutes;
    this.stopAt = stopAt;
    this.rating = rating;
    this.notes = notes;
  }

  finish({ title, type, chapters, stopAt, rating, notes, endedAt = new Date() }) {
    this.title = title;
    this.type = type;
    this.chapters = chapters;
    this.stopAt = stopAt;
    this.rating = rating;
    this.notes = notes;
    this.endedAt = endedAt;
    const diffMs = endedAt - this.startedAt;
    this.durationMinutes = Math.floor(diffMs / 60000);
  }

  toJSON() {
    return {
      id: this.id,
      roomId: this.roomId,
      title: this.title,
      type: this.type,
      chapters: this.chapters,
      sharedBy: this.sharedBy,
      usersPresent: this.usersPresent,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      durationMinutes: this.durationMinutes,
      stopAt: this.stopAt,
      rating: this.rating,
      notes: this.notes,
    };
  }
}
