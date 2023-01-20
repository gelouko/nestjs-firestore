import 'reflect-metadata';
import { MetadataStorage } from '../storages/metadata.storage';
import { getTransactionMetadataKey } from '../utils/transaction.utils';
import { TransactionNotDeclaredError } from '../errors/transaction-not-declared.error';
import { Transaction as FirestoreTransaction } from '@google-cloud/firestore';
import { Transaction } from '../transactions/transaction.provider';

export const Transactional = (
  target: any,
  functionName: string,
  descriptor: TypedPropertyDescriptor<Function>,
): void => {
  const originalMethod = descriptor.value;

  if (!originalMethod) {
    return;
  }

  const className = target?.constructor?.name || 'global';
  const transactionIndex = Reflect.getMetadata(
    getTransactionMetadataKey(className, functionName),
    target,
    functionName,
  );
  if (!transactionIndex) {
    throw new TransactionNotDeclaredError(className, functionName);
  }

  descriptor.value = withTransaction(originalMethod, transactionIndex);
};

const withTransaction = (
  originalMethod: Function,
  transactionIndex: number,
): Function => {
  return async function () {
    const firestore = MetadataStorage.getFirestore();

    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];

    const isTransactionInitialized = !!args[transactionIndex];
    if (isTransactionInitialized) {
      return originalMethod.apply(this, args);
    }

    let originalReturn;
    await firestore.runTransaction(
      async (firestoreTransaction: FirestoreTransaction) => {
        args[transactionIndex] = new Transaction(firestoreTransaction);

        originalReturn = await originalMethod.apply(this, args);
      },
    );

    return originalReturn;
  };
};
