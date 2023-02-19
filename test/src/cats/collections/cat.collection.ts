import { Collection } from '../../../../lib/collections/collection.decorator';
import { FirestoreDocument } from '../../../../lib/queries/firestore-document.dto';

@Collection()
export class Cat extends FirestoreDocument<Cat> {
  name: string;
  age: number;
  breed: string;
}
