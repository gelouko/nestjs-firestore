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
import { MetadataStorage } from './storages/metadata.storage';
import { FirestoreDocument } from './dto';

export class FirestoreProvider {
  static createFirestoreProvider = (
    options: FirestoreModuleAsyncOptions,
  ): Firestore => {
    const firestore = options.firestore
      ? options.firestore
      : new Firestore(options.firestoreSettings ?? DEFAULT_FIRESTORE_SETTINGS);

    MetadataStorage.setFirestore(firestore);

    return firestore;
  };

  static createFirestoreRepositoryProviders = (collections: Array<Type>) =>
    collections.map((collection) => ({
      provide: getRepositoryToken(collection),
      inject: [Firestore, NESTJS_FIRESTORE_CONFIG_OPTIONS],
      useFactory: (firestore: Firestore, options: FirestoreModuleCoreOptions) =>
        new FirestoreRepository<FirestoreDocument>(
          firestore,
          options,
          MetadataStorage.getCollectionMetadata(collection.name),
        ),
    }));
}
