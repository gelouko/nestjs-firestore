import { DynamicModule, Module, Type } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import {
  DEFAULT_FIRESTORE_MODULE_CORE_OPTIONS,
  NESTJS_FIRESTORE_CONFIG_OPTIONS,
} from './firestore.constants';
import { FirestoreProvider } from './firestore.provider';
import {
  FirestoreModuleAsyncOptions,
  FirestoreModuleOptions,
} from './options/firestore-module-options.interface';

@Module({})
export class FirestoreModule {
  static forRoot(
    options: FirestoreModuleOptions = DEFAULT_FIRESTORE_MODULE_CORE_OPTIONS,
  ): DynamicModule {
    return FirestoreModule.forRootAsync(options);
  }

  static forRootAsync(
    options: FirestoreModuleAsyncOptions = DEFAULT_FIRESTORE_MODULE_CORE_OPTIONS,
  ): DynamicModule {
    return {
      module: FirestoreModule,
      global: true,
      providers: [
        {
          provide: NESTJS_FIRESTORE_CONFIG_OPTIONS,
          useValue: options,
        },
        {
          provide: Firestore,
          inject: [NESTJS_FIRESTORE_CONFIG_OPTIONS],
          useFactory: FirestoreProvider.createFirestoreProvider,
        },
      ],
      exports: [Firestore, NESTJS_FIRESTORE_CONFIG_OPTIONS],
    };
  }

  static forFeature(collections: Type[] = []): DynamicModule {
    return FirestoreModule.forFeatureAsync(collections);
  }

  static forFeatureAsync(collections: Type[] = []): DynamicModule {
    const providers =
      FirestoreProvider.createFirestoreRepositoryProviders(collections);

    return {
      module: FirestoreModule,
      providers: providers,
      exports: providers,
    };
  }
}
