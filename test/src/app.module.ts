import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../lib';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [FirestoreModule.forRoot(), CatsModule],
})
export class AppModule {}
