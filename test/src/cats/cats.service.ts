import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './collections/cat.collection';
import { FirestoreRepository, InjectRepository } from '../../../lib';
import { Page } from '../../../lib/dto/page.dto';
import { SetCatResponseDto } from './dto/set-cat-response.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: FirestoreRepository<Cat>,
  ) {}

  async create(cat: Cat): Promise<Cat> {
    return this.catRepository.create(cat);
  }

  async set(cat: Cat): Promise<SetCatResponseDto> {
    const currentCat = await this.catRepository.findById(cat.id);

    const catSet = await this.catRepository.set(cat);

    return new SetCatResponseDto(currentCat === null, catSet);
  }

  async update(cat: Partial<Cat>): Promise<Partial<Cat>> {
    return this.catRepository.update(cat);
  }

  async findById(id: string): Promise<Cat | null> {
    const cat = await this.catRepository.findById(id);

    if (!cat) {
      throw new NotFoundException();
    }

    return cat;
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
