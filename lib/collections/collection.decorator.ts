/**
 * Interface defining schema options that can be passed to `@Collection()` decorator.
 */
import { MetadataStorage } from '../storages/metadata.storage';
import { CollectionUtils } from './collection.utils';
import { FirestoreDataConverter } from '@google-cloud/firestore';
import { defaultConverter } from '@google-cloud/firestore/build/src/types';

export type CollectionOptions = {
  collectionPath?: string;
  converter?: FirestoreDataConverter<any>; // TODO strict type
  softDelete?: boolean;
};

/**
 * @Collection decorator is used to mark a class as a Firestore collection.
 */
export const Collection = <T>(
  options: CollectionOptions = {},
): ClassDecorator => {
  return (target: NewableFunction) => {
    MetadataStorage.setCollectionMetadata<T>(target.name, {
      collectionPath: CollectionUtils.getCollectionPathFromAnnotatedClass(
        target,
        options,
      ),
      converter: options.converter ?? defaultConverter<T>(),
      softDelete: options.softDelete,
    });
  };
};
