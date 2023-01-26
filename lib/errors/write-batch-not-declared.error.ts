export class WriteBatchNotDeclaredError extends Error {
  constructor(className: string, functionName: string) {
    super(
      `The function ${functionName} of class ${className} has the @Batched decorator but does not have the WriteBatch argument decorated with @Batch`,
    );
  }
}
