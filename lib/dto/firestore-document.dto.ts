export abstract class FirestoreDocument<T = any> {
  /**
   * ID of the document in firestore
   * The same value as firestoreDocument's id
   */
  id: string;

  /**
   * Date of the time the document was created.
   * The same value as firestoreDocument's createTime
   */
  createTime?: Date;

  /**
   * Date of the last time the document was updated.
   * The same value as firestoreDocument's updateTime
   */
  updateTime?: Date;

  /**
   * Date of the last time the document was read.
   * The same value as firestoreDocument's readTime
   */
  readTime?: Date;

  /**
   * Deletion time when using soft deletes
   */
  deleteTime?: Date;
}
