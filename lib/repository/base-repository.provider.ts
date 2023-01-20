import { CollectionReference, Firestore } from '@google-cloud/firestore';
import { FirestoreDocument } from '../dto';
import { CollectionMetadata, FirestoreModuleCoreOptions } from '../interfaces';

export abstract class BaseRepository<T extends FirestoreDocument> {
  protected constructor(
    protected readonly firestore: Firestore,
    protected readonly firestoreModuleOptions: FirestoreModuleCoreOptions,
    protected readonly collectionOptions: CollectionMetadata<T>,
  ) {}

  /**
   * collectionRef is a getter to avoid race conditions when using operations with the collectionReference
   */
  get collectionRef(): CollectionReference<T> {
    return this.firestore
      .collection(this.collectionOptions.collectionPath)
      .withConverter(this.collectionOptions.converter);
  }
}
