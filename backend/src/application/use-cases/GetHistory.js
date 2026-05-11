export class GetHistory {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  async execute() {
    return this.sessionService.getHistory();
  }
}
