import { Transaction } from '../transaction.provider';
import { getTransactionMetadataKey } from '../utils/transaction.utils';

export const Tx = (
  target: Transaction,
  functionName: string,
  index: number,
): void => {
  const className = target.constructor.name;

  Reflect.defineMetadata(
    getTransactionMetadataKey(className, functionName),
    index,
    target,
    functionName,
  );
};
