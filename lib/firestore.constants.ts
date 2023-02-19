import { Type } from '@nestjs/common';
import { FirestoreModuleOptions } from './options/firestore-module-options.interface';

export const NESTJS_FIRESTORE_CONFIG_OPTIONS =
  'NESTJS_FIRESTORE_CONFIG_OPTIONS';

export const DEFAULT_FIRESTORE_MODULE_CORE_OPTIONS: FirestoreModuleOptions = {};
export const DEFAULT_FIRESTORE_SETTINGS = {
  ignoreUndefinedProperties: true,
};

export const getRepositoryToken = (documentType: Type) =>
  `${documentType.name}Repository`;
