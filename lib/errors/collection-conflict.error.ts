export class CollectionConflictError extends Error {
  constructor(collectionPath: string) {
    super(`There is already a collection with the path "${collectionPath}.
        Check if your classes annotated with @Collection all have different names 
        or if they do have the same name, they have different collectionPaths attributes."`);
  }
}
