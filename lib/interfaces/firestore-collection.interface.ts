import { FirestoreDataConverter } from '@google-cloud/firestore';

export interface CollectionMetadata<T> {
  collectionPath: string;
  converter: FirestoreDataConverter<T>;
  softDelete?: boolean;
}
