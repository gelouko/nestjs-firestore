import { Collection } from '../../../../lib';
import { FirestoreDocument } from '../../../../lib';

@Collection()
export class Cat extends FirestoreDocument<Cat> {
  name: string;
  age: number;
  breed: string;
}
