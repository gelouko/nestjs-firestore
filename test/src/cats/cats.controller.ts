import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './collections/cat.collection';
import { Page } from '../../../lib/repositories/queries/dto/page.dto';
import { Response } from 'express';
import { UpdateCatDto } from './dto/update-cat.dto';
import { SetSurnameDto } from './dto/set-surname.dto';
import { FirestoreDocument } from '../../../lib/repositories/queries/dto/firestore-document.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    const cat = new Cat();
    cat.name = createCatDto.name;
    cat.breed = createCatDto.breed;
    cat.age = createCatDto.age;

    return this.catsService.create(cat);
  }

  @Put(':id')
  async set(
    @Param('id') id: string,
    @Body() createCatDto: CreateCatDto,
    @Res() res: Response,
  ) {
    const catDto = new Cat();

    catDto.name = createCatDto.name;
    catDto.breed = createCatDto.breed;
    catDto.age = createCatDto.age;
    catDto.id = id;

    const { cat, isNew } = await this.catsService.set(catDto);

    res.status(isNew ? 201 : 200).json(cat);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    const cat: Partial<Cat> = new Cat();

    cat.name = updateCatDto.name;
    cat.breed = updateCatDto.breed;
    cat.age = updateCatDto.age;
    cat.id = id;

    return await this.catsService.update(cat);
  }

  @Get('list')
  async list(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('orderBy') orderBy: string,
    @Query('startAt') startAt: any,
  ): Promise<Page<Cat>> {
    return this.catsService.list(limit, orderBy, startAt);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<FirestoreDocument<Cat> | null> {
    return this.catsService.findById(id);
  }

  @Get()
  async findByQuery(
    @Query('name') name: string,
    @Query('breed') breed: string,
  ): Promise<FirestoreDocument<Cat>[]> {
    return this.catsService.findByNameAndBreed(name, breed);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.catsService.delete(id);
  }

  @Patch(':id/surname')
  async setSurname(
    @Param('id') id: string,
    @Body() surnameDto: SetSurnameDto,
  ): Promise<Cat> {
    return this.catsService.setSurname(id, surnameDto.surname);
  }

  @Post('procreate')
  async procreate(): Promise<Cat[]> {
    return this.catsService.procreate();
  }
}
