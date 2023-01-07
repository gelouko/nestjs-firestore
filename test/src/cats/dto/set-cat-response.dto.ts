import { Cat } from '../collections/cat.collection';

export class SetCatResponseDto {
  constructor(readonly isNew: boolean, readonly cat: Cat) {}
}
