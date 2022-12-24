import { Injectable } from '@nestjs/common';
import { Cat } from './collections/cat.collection';
import { FirestoreRepository, InjectRepository } from '../../../lib';
import { Page } from '../../../lib/dto/page.dto';

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

  async list(limit: number, orderBy: string, startAt: any): Promise<Page<Cat>> {
    return await this.catRepository
      .list()
      .limit(limit)
      .orderByDesc(orderBy)
      .startAt(startAt)
      .get();
  }

  async findByNameAndBreed(name: string, breed: string): Promise<Cat[]> {
    return this.catRepository
      .where('name')
      .equals(name)
      .and('breed')
      .equals(breed)
      .get();
  }
}
