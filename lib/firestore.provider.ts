import { Type } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import {
  DEFAULT_FIRESTORE_SETTINGS,
  getRepositoryToken,
  NESTJS_FIRESTORE_CONFIG_OPTIONS,
} from './firestore.constants';
import { FirestoreRepository } from './repositories';
import { MetadataStorage } from './storages/metadata.storage';
import {
  FirestoreModuleAsyncOptions,
  FirestoreModuleCoreOptions,
} from './options/firestore-module-options.interface';
import { FirestoreDocument } from './repositories/queries/dto/firestore-document.dto';

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
