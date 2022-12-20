import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './collections/cat.collection';
import { FirestoreDocument } from '../../../lib';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    const cat = new Cat(); // TODO use constructor
    cat.name = createCatDto.name;
    cat.breed = createCatDto.breed;
    cat.age = createCatDto.age;

    return this.catsService.create(cat);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<FirestoreDocument<Cat> | null> {
    return this.catsService.findById(id);
  }
}
