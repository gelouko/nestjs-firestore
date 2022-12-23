<!-- ALL-CONTRIBUTORS-BADGE:START -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## NestJS Firestore

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

## Using the firestore client

We understand that sometimes there might be a feature in the cli that we haven't implemented yet

In this case, you can directly inject the Firestore class, and it will use the configured instance in forRoot

```typescript
@Injectable()
export class CatsService {
    constructor(
        private readonly firestoreCli: Firestore,
    ) {}
    
    async update(cat: Cat): Promise<Cat> {
        // update some fields of a document without overwriting the entire document, use the following language-specific update() method:
        await this.firestoreCli.collection(cats).doc(cat.id).update({ name: 'Frank' });
    }
}

```

## Contribute

Check the `.github/contributing.md` file to learn how to contribute including 
steps to build the project and the guidelines for contributing

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/maddy020"><img src="https://avatars.githubusercontent.com/u/103564105?v=4?s=100" width="100px;" alt="maddy020"/><br /><sub><b>maddy020</b></sub></a><br /><a href="https://github.com/gelouko/nestjs-firestore/commits?author=maddy020" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->


## License

nestjs-firestore is [MIT licensed](LICENSE).
