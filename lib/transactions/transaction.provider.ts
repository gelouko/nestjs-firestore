import {
  DocumentReference,
  DocumentSnapshot,
  Transaction as FirestoreTransaction,
  UpdateData,
  WithFieldValue,
} from '@google-cloud/firestore';
import { FirestoreDocument } from '../dto';

export class Transaction {
  private firestoreTransaction: FirestoreTransaction;

  constructor(firestoreTransaction: FirestoreTransaction) {
    this.firestoreTransaction = firestoreTransaction;
  }

  async _get<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
  ): Promise<DocumentSnapshot<T>> {
    return this.firestoreTransaction.get(docRef);
  }

  async _getAll<T extends FirestoreDocument>(
    docRefs: DocumentReference<T>[],
  ): Promise<Array<DocumentSnapshot<T>>> {
    return this.firestoreTransaction.getAll(...docRefs);
  }

  _create<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
    data: WithFieldValue<T>,
  ) {
    this.firestoreTransaction = this.firestoreTransaction.create(docRef, data);
  }

  _update<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
    data: UpdateData<T>,
  ) {
    this.firestoreTransaction = this.firestoreTransaction.update(docRef, data);
  }

  _delete<T extends FirestoreDocument>(docRef: DocumentReference<T>) {
    this.firestoreTransaction = this.firestoreTransaction.delete(docRef);
  }
}
