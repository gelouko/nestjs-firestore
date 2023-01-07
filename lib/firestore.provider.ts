import { Type } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import {
  FirestoreModuleAsyncOptions,
  FirestoreModuleCoreOptions,
} from './interfaces';
import {
  DEFAULT_FIRESTORE_SETTINGS,
  getRepositoryToken,
  NESTJS_FIRESTORE_CONFIG_OPTIONS,
} from './firestore.constants';
import { FirestoreRepository } from './repository';
import { CollectionMetadataStorage } from './storages/collection-metadata.storage';
import { FirestoreDocument } from './dto';

export class FirestoreProvider {
  static createFirestoreProvider = (
    options: FirestoreModuleAsyncOptions,
  ): Firestore =>
    options.firestore ??
    new Firestore(options.firestoreSettings ?? DEFAULT_FIRESTORE_SETTINGS);

  static createFirestoreRepositoryProviders = (collections: Array<Type>) =>
    collections.map((collection) => ({
      provide: getRepositoryToken(collection),
      inject: [Firestore, NESTJS_FIRESTORE_CONFIG_OPTIONS],
      useFactory: (firestore: Firestore, options: FirestoreModuleCoreOptions) =>
        new FirestoreRepository<FirestoreDocument>(
          firestore,
          options,
          CollectionMetadataStorage.getCollectionMetadata(collection.name),
        ),
    }));
}
