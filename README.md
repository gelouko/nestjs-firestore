<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## NestJS Firestoregit s

[Firestore](https://cloud.google.com/firestore/docs/reference/libraries) module for [Nest](https://github.com/nestjs/nest).

This project is active, but under construction. Check the repository v1.0 project to see what's coming next.

If there's something you'd love to have here, feel free to create an issue. We'll do our best to answer in 2 days!

## Installation

In your Nest generated project, run

```bash
$ npm i --save nestjs-firestore @google-cloud/firestore
```

## Usage

Check the `test/e2e/src` code for a full working example

```typescript
// Root module
@Module({
    imports: [FirestoreModule.forRoot()],
})
export class RootModule {}

// Module which you want to use a repository:
@Module({
    imports: [FirestoreModule.forFeature([Cat])],
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {}

// The service where you will inject the repository
@Injectable()
export class CatsService {
    constructor(
        @InjectRepository(Cat)
        private readonly catRepository: FirestoreRepository<Cat>,
    ) {
    }

    async create(cat: Cat): Promise<Cat> {
        return await this.catRepository.create(cat);
    }

    async findById(id: string): Promise<Cat | null> {
        return this.catRepository.findById(id);
    }
}
```

## Firestore's update method
   To update some fields of a document without overwriting the entire document, use the following language-specific update() methods:

   In nested Objects -
   
   const initialData = {
   name: 'Frank',
   age: 12,
   favorites: {
   food: 'Pizza',
   color: 'Blue',
   subject: 'recess'
  }
};

// ...
   const res = await db.collection('users').doc('Frank').update({
   age: 13,
  'favorites.color': 'Red'
});


## Contribute

Check the `.github/contributing.md` file to learn how to contribute including 
steps to build the project and the guidelines for contributing

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->


## License

nestjs-firestore is [MIT licensed](LICENSE).
