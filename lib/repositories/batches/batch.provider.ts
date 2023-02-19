import {
  DocumentReference,
  UpdateData,
  WithFieldValue,
  WriteBatch as FirestoreWriteBatch,
} from '@google-cloud/firestore';
import { FirestoreDocument } from '../queries/dto/firestore-document.dto';

export class WriteBatch {
  private firestoreBatch: FirestoreWriteBatch;

  constructor(firestoreBatch: FirestoreWriteBatch) {
    this.firestoreBatch = firestoreBatch;
  }

  _create<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
    data: WithFieldValue<T>,
  ) {
    this.firestoreBatch = this.firestoreBatch.create(docRef, data);
  }

  _update<T extends FirestoreDocument>(
    docRef: DocumentReference<T>,
    data: UpdateData<T>,
  ) {
    this.firestoreBatch = this.firestoreBatch.update(docRef, data);
  }

  _delete<T extends FirestoreDocument>(docRef: DocumentReference<T>) {
    this.firestoreBatch = this.firestoreBatch.delete(docRef);
  }
}
