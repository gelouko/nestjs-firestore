import { Collection } from '../../../../lib/collections/decorators/collection.decorator';
import { FirestoreDocument } from '../../../../lib/repositories/queries/dto/firestore-document.dto';

@Collection()
export class Cat extends FirestoreDocument<Cat> {
  name: string;
  age: number;
  breed: string;
}
