import 'reflect-metadata';
import { MetadataStorage } from '../storages/metadata.storage';
import { getWriteBatchMetadataKey } from './write-batch.utils';
import { WriteBatchNotDeclaredError } from '../errors/write-batch-not-declared.error';
import { WriteBatch } from './batch.provider';

export const Batched = (
  target: any,
  functionName: string,
  descriptor: TypedPropertyDescriptor<Function>,
): void => {
  const originalMethod = descriptor.value;

  if (!originalMethod) {
    return;
  }

  const className = target?.constructor?.name || 'global';
  const writeBatchIndex = Reflect.getMetadata(
    getWriteBatchMetadataKey(className, functionName),
    target,
    functionName,
  );
  if (!writeBatchIndex === undefined) {
    throw new WriteBatchNotDeclaredError(className, functionName);
  }

  descriptor.value = withBatch(originalMethod, writeBatchIndex);
};

const withBatch = (
  originalMethod: Function,
  writeBatchIndex: number,
): Function => {
  return async function () {
    const firestore = MetadataStorage.getFirestore();

    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];

    const isWriteBatchInitialized = !!args[writeBatchIndex];
    if (isWriteBatchInitialized) {
      return originalMethod.apply(this, args);
    }

    const batch = firestore.batch();
    args[writeBatchIndex] = new WriteBatch(batch);

    const originalReturn = await originalMethod.apply(this, args);

    await batch.commit();

    return originalReturn;
  };
};
