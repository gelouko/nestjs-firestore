import { Firestore, Settings } from '@google-cloud/firestore';

/**
 * The module can be instantiated using an already built firestore module or
 * the user can provide the firestore configuration to build firestore
 */
export type FirestoreModuleAsyncOptions = FirestoreModuleOptions;
export type FirestoreModuleOptions = {
  settings?: FirestoreModuleCoreOptions;
  firestore?: Firestore;
  firestoreSettings?: Settings;
};

// TODO implement interface
export interface FirestoreModuleCoreOptions {
  softDelete?: boolean;
}
