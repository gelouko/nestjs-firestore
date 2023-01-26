import { FirestoreDocument } from '../dto';
import { InvalidArgumentError } from '../errors/invalid-argument.error';
import {
  DocumentReference,
  Firestore,
  UpdateData,
} from '@google-cloud/firestore';
import { BaseRepository } from './base-repository.provider';
import { CollectionMetadata, FirestoreModuleCoreOptions } from '../interfaces';
import { WriteBatch } from '../batches/batch.provider';

export class WriteBatchRepository<
  T extends FirestoreDocument,
> extends BaseRepository<T> {
  constructor(
    firestore: Firestore,
    firestoreModuleOptions: FirestoreModuleCoreOptions,
    collectionOptions: CollectionMetadata<T>,
    private readonly batch: WriteBatch,
  ) {
    super(firestore, firestoreModuleOptions, collectionOptions);
  }

  create(document: T): T {
    const { id, ...object } = document;

    const docRef = id ? this.collectionRef.doc(id) : this.collectionRef.doc();
    this.batch._create(docRef, object as T);

    return {
      ...document,
      id: docRef.id,
    };
  }

  update(document: Partial<T>): Partial<T> {
    const { id, ...object } = document;

    if (!id) {
      throw new InvalidArgumentError('id is required when updating an entity');
    }

    const docRef = this.collectionRef.doc(id);
    this.batch._update(docRef, object as UpdateData<T>);

    return {
      ...document,
    };
  }

  delete(id: string): void {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);

    if (this.collectionOptions.softDelete) {
      this.batch._update(docRef, { deleteTime: new Date() } as UpdateData<T>);
    } else if (
      !this.firestoreModuleOptions.softDelete &&
      this.collectionOptions.softDelete
    ) {
      this.batch._update(docRef, {
        deleteTime: new Date(),
      } as UpdateData<T>);
    } else {
      this.batch._delete(docRef);
    }
  }
}
