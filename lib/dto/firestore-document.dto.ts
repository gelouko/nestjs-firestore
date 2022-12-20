export abstract class FirestoreDocument<T> {
  id: string;
  createTime?: Date;
  updateTime?: Date;
  readTime?: Date;
}
