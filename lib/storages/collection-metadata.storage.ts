import { CollectionMetadata } from '../interfaces';
import { CollectionConflictError } from '../errors';

class CollectionMetadataStorageHost {
  private collections: Record<string, CollectionMetadata<any>> = {}; // TODO strict type

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
}

const globalRef = global as unknown as {
  NestjsFirestoreTypeMetadataStorage: CollectionMetadataStorageHost;
};
export const CollectionMetadataStorage: CollectionMetadataStorageHost =
  globalRef.NestjsFirestoreTypeMetadataStorage ||
  (globalRef.NestjsFirestoreTypeMetadataStorage =
    new CollectionMetadataStorageHost());
