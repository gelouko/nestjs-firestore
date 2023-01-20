import {
  DocumentReference,
  DocumentSnapshot,
  Transaction as FirestoreTransaction,
  UpdateData,
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

  _update<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
    data: UpdateData<T>,
  ) {
    this.firestoreTransaction = this.firestoreTransaction.update(docRef, data);
  }
}
