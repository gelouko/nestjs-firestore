import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../../lib';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './collections/cat.collection';

@Module({
  imports: [FirestoreModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
