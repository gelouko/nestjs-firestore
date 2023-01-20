import {
  CollectionReference,
  DocumentReference,
  Firestore,
  UpdateData,
  WriteResult,
} from '@google-cloud/firestore';
import { CollectionMetadata, FirestoreModuleCoreOptions } from '../interfaces';
import { CollectionNotDefinedError } from '../errors/collection-not-defined.error';
import { FirestoreDocument } from '../dto';
import { WhereQuery } from './where.query';
import { PageQuery } from './page.query';
import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { Transaction } from '../transactions/transaction.provider';

export class FirestoreRepository<T extends FirestoreDocument> {
  private collectionOptions: CollectionMetadata<T>;

  constructor(
    private readonly firestore: Firestore,
    private readonly firestoreModuleOptions: FirestoreModuleCoreOptions,
    collectionOptions: CollectionMetadata<T> | null,
  ) {
    if (!collectionOptions) {
      throw new CollectionNotDefinedError();
    }
    this.collectionOptions = collectionOptions;
  }

  /**
   * collectionRef is a getter to avoid race conditions when using operations with the collectionReference
   */
  get collectionRef(): CollectionReference<T> {
    return this.firestore
      .collection(this.collectionOptions.collectionPath)
      .withConverter(this.collectionOptions.converter);
  }

  async create(document: T): Promise<T> {
    const { id, ...object } = document; // TODO add to function to put subCollections later

    const docRef = id ? this.collectionRef.doc(id) : this.collectionRef.doc();

    const result = await docRef.create(object as T);

    return {
      ...document,
      createTime: result.writeTime.toDate(),
      updateTime: result.writeTime.toDate(),
      id: docRef.id,
    };
  }

  async set(document: T): Promise<T> {
    const { id, ...object } = document;

    if (!id) {
      throw new InvalidArgumentError('id is required when setting an entity');
    }

    const docRef = this.collectionRef.doc(id);
    const result = await docRef.set(object as T);

    return {
      ...document,
      createTime: result.writeTime.toDate(),
      updateTime: result.writeTime.toDate(),
    };
  }

  async update(
    document: Partial<T>,
    options?: { tx?: Transaction },
  ): Promise<Partial<T>> {
    const { id, ...object } = document;

    if (!id) {
      throw new InvalidArgumentError('id is required when updating an entity');
    }

    const docRef = this.collectionRef.doc(id);

    if (options?.tx) {
      options.tx._update(docRef, object as UpdateData<T>);

      return {
        ...document,
      };
    }

    const result = await docRef.update(object as UpdateData<T>);

    return {
      ...document,
      updateTime: result.writeTime.toDate(),
    };
  }

  async findById(
    id: string,
    options?: { tx?: Transaction },
  ): Promise<T | null> {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);

    const doc = options?.tx
      ? await options.tx._get(docRef)
      : await docRef.get();

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

  async delete(id: string): Promise<Date> {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);

    let result: WriteResult;
    if (this.collectionOptions.softDelete) {
      result = await docRef.update('deleteTime', new Date());
    } else if (
      !this.firestoreModuleOptions.softDelete &&
      this.collectionOptions.softDelete
    ) {
      result = await docRef.update('deleteTime', new Date());
    } else {
      result = await docRef.delete();
    }

    return result.writeTime.toDate();
  }

  where(property: string): WhereQuery<T> {
    return new WhereQuery<T>(this.collectionRef, property);
  }

  list(): PageQuery<T> {
    return new PageQuery<T>(this.collectionRef);
  }
}
