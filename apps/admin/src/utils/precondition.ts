export class PreconditionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreconditionError";
  }
}

export class MutualExclusivityError extends PreconditionError {
  constructor(message: string) {
    super(message);
    this.name = "MutualExclusivityError";
  }
}

const precondition = (condition: boolean, errorMessage: string): void => {
  if (!condition) throw new PreconditionError(errorMessage);
};

export default precondition;
