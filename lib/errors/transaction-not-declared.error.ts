export class TransactionNotDeclaredError extends Error {
  constructor(className: string, functionName: string) {
    super(
      `The function ${functionName} of class ${className} has the @Transactional decorator but does not have the Transaction argument decorated with @Tx`,
    );
  }
}
