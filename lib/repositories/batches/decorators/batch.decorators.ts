import { getWriteBatchMetadataKey } from '../utils/write-batch.utils';
import { WriteBatch } from '../batch.provider';

export const Batch = (
  target: WriteBatch,
  functionName: string,
  index: number,
): void => {
  const className = target.constructor.name;

  Reflect.defineMetadata(
    getWriteBatchMetadataKey(className, functionName),
    index,
    target,
    functionName,
  );
};
