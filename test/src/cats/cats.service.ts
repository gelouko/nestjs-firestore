import { Injectable } from '@nestjs/common';
import { Cat } from './collections/cat.collection';
import { FirestoreRepository, InjectRepository } from '../../../lib';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: FirestoreRepository<Cat>,
  ) {}

  async create(cat: Cat): Promise<Cat> {
    return this.catRepository.create(cat);
  }

  async findById(id: string): Promise<Cat | null> {
    return this.catRepository.findById(id);
  }

  async delete(id: string) {
    return this.catRepository.delete(id);
  }
}
