import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './collections/cat.collection';
import { Page } from '../../../lib/queries/page.dto';
import { SetCatResponseDto } from './dto/set-cat-response.dto';
import { Transactional } from '../../../lib/transactions/transactional.decorator';
import { Transaction } from '../../../lib/transactions/transaction.provider';
import { Tx } from '../../../lib/transactions/tx.decorators';
import { Batched } from '../../../lib/batches/batched.decorator';
import { WriteBatch } from '../../../lib/batches/batch.provider';
import { Batch } from '../../../lib/batches/batch.decorators';
import { InjectRepository } from '../../../lib/repositories/inject-repository.decorator';
import { FirestoreRepository } from '../../../lib';

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

  @Transactional
  async setSurname(
    catId: string,
    surname: string,
    @Tx tx?: Transaction,
  ): Promise<Cat> {
    if (!tx) {
      throw new InternalServerErrorException();
    }

    const catTransactionalRepository = this.catRepository.withTransaction(tx);

    const cat = await catTransactionalRepository.findById(catId);
    if (!cat) {
      throw new NotFoundException();
    }

    cat.name = `${cat.name} ${surname}`;
    await catTransactionalRepository.update(cat);

    return cat;
  }

  @Batched
  async procreate(@Batch batch?: WriteBatch): Promise<Cat[]> {
    const maxCatKittenQuantity = 19;

    if (!batch) {
      throw new InternalServerErrorException();
    }
    const catWriteBatchRepository = this.catRepository.withBatch(batch);

    const numberOfKittens = Math.ceil(maxCatKittenQuantity * Math.random());
    const kittens = new Array(numberOfKittens);

    for (let i = 0; i <= numberOfKittens; i++) {
      const kitten = new Cat();
      kitten.name = `Kitten ${i + 1}`;
      kitten.age = 0;
      kitten.breed = 'unknown';

      kittens[i] = kitten;
      catWriteBatchRepository.create(kitten);
    }

    return kittens;
  }
}
