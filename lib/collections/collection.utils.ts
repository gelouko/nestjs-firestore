import { plural } from 'pluralize';
import { CollectionOptions } from './collection.decorator';

export class CollectionUtils {
  /**
   * Gets the collection name with the @Collection decorator information
   *
   * @param options @Collection options
   * @param target annotated class constructor
   */
  static getCollectionPathFromAnnotatedClass(
    target: NewableFunction,
    options: CollectionOptions,
  ): string {
    // TODO build CollectionSchema type and save only the CollectionSchema
    // TODO get properties
    const path = options.collectionPath ?? target.name;

    return plural(path.toLowerCase());
  }
}
