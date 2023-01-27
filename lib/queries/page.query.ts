import { Query } from '@google-cloud/firestore';
import { Page } from './page.dto';
import { FirestoreDocument } from './firestore-document.dto';

export class PageQuery<T extends FirestoreDocument> {
  constructor(protected query: Query<T>) {}

  limit(limit: number): PageQuery<T> {
    this.query = this.query.limit(limit);

    return this;
  }

  orderByDesc(propertyName: string): OrderedPageQuery<T> {
    this.query = this.query.orderBy(propertyName, 'desc');

    return new OrderedPageQuery<T>(this.query);
  }

  async get(): Promise<Page<T>> {
    const results = await this.query.get();

    const documents: Array<T> = results.docs
      .map((doc) => {
        if (!doc.exists) {
          return null;
        }

        const docData = doc.data();

        if (docData.deleteTime) {
          return null;
        }

        return {
          ...docData,
          id: doc.id,
          createTime: doc.createTime?.toDate(),
          updateTime: doc.updateTime?.toDate(),
          readTime: doc.readTime?.toDate(),
        } as T;
      })
      .filter((doc) => !!doc) as Array<T>;

    return new Page<T>(documents);
  }
}

class OrderedPageQuery<T extends FirestoreDocument> extends PageQuery<T> {
  constructor(query: Query<T>) {
    super(query);
  }

  startAt(value: any | any[]) {
    this.query = this.query.startAt(value);

    return this;
  }
}
