export class CollectionNotDefinedError extends Error {
  constructor() {
    super(`There is a repository for a class that does not have the @Collection decorator.
    Please, check your collections to see if all of them have the @Collection decorator in their classes.`);
  }
}
