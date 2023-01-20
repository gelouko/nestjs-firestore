import { Transaction } from '../transactions/transaction.provider';
import { FirestoreDocument } from '../dto';
import { InvalidArgumentError } from '../errors/invalid-argument.error';
import {
  DocumentReference,
  Firestore,
  UpdateData,
} from '@google-cloud/firestore';
import { BaseRepository } from './base-repository.provider';
import { CollectionMetadata, FirestoreModuleCoreOptions } from '../interfaces';

export class TransactionalRepository<
  T extends FirestoreDocument,
> extends BaseRepository<T> {
  constructor(
    firestore: Firestore,
    firestoreModuleOptions: FirestoreModuleCoreOptions,
    collectionOptions: CollectionMetadata<T>,
    private readonly tx: Transaction,
  ) {
    super(firestore, firestoreModuleOptions, collectionOptions);
  }

  async create(document: T): Promise<T> {
    const { id, ...object } = document;

    const docRef = id ? this.collectionRef.doc(id) : this.collectionRef.doc();
    this.tx._create(docRef, object as T);

    return {
      ...document,
      id: docRef.id,
    };
  }

  async update(document: Partial<T>): Promise<Partial<T>> {
    const { id, ...object } = document;

    if (!id) {
      throw new InvalidArgumentError('id is required when updating an entity');
    }

    const docRef = this.collectionRef.doc(id);
    this.tx._update(docRef, object as UpdateData<T>);

    return {
      ...document,
    };
  }

  async delete(id: string): Promise<void> {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);

    if (this.collectionOptions.softDelete) {
      this.tx._update(docRef, { deleteTime: new Date() } as UpdateData<T>);
    } else if (
      !this.firestoreModuleOptions.softDelete &&
      this.collectionOptions.softDelete
    ) {
      this.tx._update(docRef, {
        deleteTime: new Date(),
      } as UpdateData<T>);
    } else {
      this.tx._delete(docRef);
    }
  }

  async findById(id: string): Promise<T | null> {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);

    const doc = await this.tx._get(docRef);
    if (!doc.exists) {
      return null;
    }

    const docData = doc.data() as FirestoreDocument;
    if (docData.deleteTime) {
      return null;
    }

    return {
      ...docData,
      id: doc.id,
      createTime: doc.createTime?.toDate(),
      updateTime: doc.updateTime?.toDate(),
      readTime: doc.readTime?.toDate(),
    } as T;
  }
}
