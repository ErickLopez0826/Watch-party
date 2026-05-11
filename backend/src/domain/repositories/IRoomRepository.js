// Interface contract for Room persistence.
// Concrete implementations live in infrastructure/database/repositories.

export class IRoomRepository {
  findByCode(_code) { throw new Error('Not implemented'); }
  findById(_id)     { throw new Error('Not implemented'); }
  save(_room)       { throw new Error('Not implemented'); }
  delete(_id)       { throw new Error('Not implemented'); }
}
