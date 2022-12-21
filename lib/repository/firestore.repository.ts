import {
  CollectionReference,
  DocumentReference,
  Firestore,
} from '@google-cloud/firestore';
import { CollectionMetadata, FirestoreModuleCoreOptions } from '../interfaces';
import { defaultConverter } from '@google-cloud/firestore/build/src/types';
import { CollectionNotDefinedError } from '../errors/collection-not-defined.error';
import { FirestoreDocument } from '../dto';

// TODO implement
export class FirestoreRepository<T> {
  private collectionRef: CollectionReference<T>;
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

    this.collectionRef = this.firestore
      .collection(this.collectionOptions.collectionPath)
      .withConverter(this.collectionOptions.converter ?? defaultConverter<T>());
  }

  async create(document: FirestoreDocument<T>): Promise<FirestoreDocument<T>> {
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

  async findById(id: string): Promise<T | null> {
    const docRef: DocumentReference<T> = this.collectionRef.doc(id);
    const doc = await docRef.get();

    return {
      ...doc.data(),
      id: doc.id,
      createTime: doc.createTime?.toDate(),
      updateTime: doc.updateTime?.toDate(),
      readTime: doc.readTime?.toDate(),
    } as T;
  }
}
