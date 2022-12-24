/**
 * This is a wrapper class for a Page of firestore documents
 */
export class Page<T> {
  constructor(readonly items: Array<T>) {}
}
