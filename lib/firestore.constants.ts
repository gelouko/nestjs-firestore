import { FirestoreModuleOptions } from './interfaces';
import { Type } from '@nestjs/common';

export const NESTJS_FIRESTORE_CONFIG_OPTIONS =
  'NESTJS_FIRESTORE_CONFIG_OPTIONS';

export const defaultFirestoreModuleOptions: FirestoreModuleOptions = {};

export const getRepositoryToken = (documentType: Type) =>
  `${documentType.name}Repository`;
