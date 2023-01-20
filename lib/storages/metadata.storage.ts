import { CollectionMetadata } from '../interfaces';
import { CollectionConflictError } from '../errors';
import { Firestore } from '@google-cloud/firestore';

export class NestJsFirestoreMetadataStorageHost {
  private collections: Record<string, CollectionMetadata<any>> = {}; // TODO strict type
  private firestore: Firestore;

  /**
   * Sets the collection metadata using a string key.
   *
   * @param key the class name
   * @param metadata all the collection information needed to perform correct operations in the library
   */
  setCollectionMetadata<T>(key: string, metadata: CollectionMetadata<T>) {
    const existing = this.getCollectionMetadata(key);
    if (existing) {
      throw new CollectionConflictError(key);
    }

    this.collections[key] = metadata;
  }

  /**
   * Gets the collection metadata using a string key.
   *
   * @param key the class name
   * @returns the collection metadata
   */
  getCollectionMetadata<T>(key: string): CollectionMetadata<T> | null {
    return this.collections[key] ?? null;
  }

  /**
   * Sets the current firestore object in the metadata
   * @param instance the current firestore instance
   */
  setFirestore(instance: Firestore) {
    // if (this.firestore) {
    //   throw new CollectionConflictError('nestjs-firestore-instance');
    // }

    this.firestore = instance;
  }

  /**
   * Gets the current firestore instance, mainly for decorator purposes
   *
   * @returns the current firestore instance
   */
  getFirestore(): Firestore {
    return this.firestore ?? null;
  }
}

const globalRef = global as unknown as {
  NestJsFirestoreMetadataStorage: NestJsFirestoreMetadataStorageHost;
};
export const MetadataStorage: NestJsFirestoreMetadataStorageHost =
  globalRef.NestJsFirestoreMetadataStorage ||
  (globalRef.NestJsFirestoreMetadataStorage =
    new NestJsFirestoreMetadataStorageHost());
