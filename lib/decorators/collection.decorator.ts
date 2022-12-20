/**
 * Interface defining schema options that can be passed to `@Collection()` decorator.
 */
import { CollectionMetadataStorage } from '../storages/collection-metadata.storage';
import { CollectionUtils } from '../utils/collection.utils';
import { FirestoreDataConverter } from '@google-cloud/firestore';

export type CollectionOptions = {
  collectionPath?: string;
  converter?: FirestoreDataConverter<any>; // TODO strict type
};

/**
 * @Collection decorator is used to mark a class as a Firestore collection.
 */
export const Collection = <T>(
  options: CollectionOptions = {},
): ClassDecorator => {
  return (target: NewableFunction) => {
    CollectionMetadataStorage.setCollection<T>(target.name, {
      collectionPath: CollectionUtils.getCollectionPathFromAnnotatedClass(
        target,
        options,
      ),
      converter: options.converter,
    });
  };
};
