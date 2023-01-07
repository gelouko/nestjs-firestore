import { FirestoreDocument } from './firestore-document.dto';

export class RepositorySetDto<T extends FirestoreDocument> {
  isNew: boolean;
  data: T;
}
