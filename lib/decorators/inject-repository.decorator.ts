import { Inject, Type } from '@nestjs/common';
import { getRepositoryToken } from '../firestore.constants';

export const InjectRepository = (documentType: Type): ParameterDecorator =>
  Inject(getRepositoryToken(documentType));
