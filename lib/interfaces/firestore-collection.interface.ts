import { FirestoreDataConverter } from '@google-cloud/firestore';

export interface CollectionMetadata<T> {
  collectionPath: string;
  softDelete: boolean;
  converter: FirestoreDataConverter<T>;
}
