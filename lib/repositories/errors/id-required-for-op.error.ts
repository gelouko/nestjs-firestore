export class IdRequiredForOpError extends Error {
  constructor() {
    super('ID is required for this operation.');
  }
}
