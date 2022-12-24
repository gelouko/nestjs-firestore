import { Query, WhereFilterOp } from '@google-cloud/firestore';
import { FirestoreDocument } from '../dto';
import { PageQuery } from './page.query';

/**
 * https://firebase.google.com/docs/firestore/query-data/queries
 */
export class WhereQuery<T extends FirestoreDocument> {
  constructor(private query: Query<T>, private readonly propertyName: string) {}

  /**
   * adds a == clause to the query
   * @param value
   */
  equals(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('==', value);
  }

  lesserThan(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('<', value);
  }

  lesserThanOrEqualTo(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('<=', value);
  }

  differentFrom(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('!=', value);
  }

  greaterThan(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('>', value);
  }

  greaterThanOrEqualTo(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('>=', value);
  }

  contains(value: any): ReadyWhereQuery<T> {
    return this.appendQuery('array-contains', value);
  }

  containsAny(value: Array<any>): ReadyWhereQuery<T> {
    return this.appendQuery('array-contains-any', value);
  }

  in(value: Array<any>): ReadyWhereQuery<T> {
    return this.appendQuery('in', value);
  }

  notIn(value: Array<any>): ReadyWhereQuery<T> {
    return this.appendQuery('not-in', value);
  }

  private appendQuery(
    operation: WhereFilterOp,
    value: any,
  ): ReadyWhereQuery<T> {
    return new ReadyWhereQuery<T>(
      this.query.where(this.propertyName, operation, value),
    );
  }
}

class ReadyWhereQuery<T extends FirestoreDocument> {
  constructor(private query: Query<T>) {}

  and(propertyName: string) {
    return new WhereQuery(this.query, propertyName);
  }

  paginate(): PageQuery<T> {
    return new PageQuery<T>(this.query);
  }

  async get(): Promise<Array<T>> {
    const result = await this.query.get();

    return result.docs
      .map((doc): T | null => {
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
  }
}
