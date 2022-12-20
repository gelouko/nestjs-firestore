import { Injectable } from '@nestjs/common';
import { Cat } from './collections/cat.collection';
import { FirestoreRepository } from '../../../lib';
import { InjectRepository } from '../../../lib';
import { FirestoreDocument } from '../../../lib';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: FirestoreRepository<Cat>,
  ) {}

  async create(cat: Cat): Promise<FirestoreDocument<Cat>> {
    return this.catRepository.create(cat);
  }

  async findById(id: string): Promise<FirestoreDocument<Cat> | null> {
    return this.catRepository.findById(id);
  }
}
