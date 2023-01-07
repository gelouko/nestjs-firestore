export class InvalidArgumentError extends Error {
  constructor(message = 'Invalid input for function') {
    super(message);
  }
}
