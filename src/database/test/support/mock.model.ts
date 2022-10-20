export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  findOne(): {
    sort(): {
      limit(): {
        exec: () => T;
      };
    };
    exec: () => T;
  } {
    return {
      sort(): { limit(): { exec: () => T } } {
        return {
          limit: () => {
            return {
              exec: (): T => {
                return this.exec();
              },
            };
          },
        };
      },
      exec: (): T => this.entityStub,
    };
  }

  // the find function should return a promise
  find(): { sort: () => Promise<T[]> } {
    return {
      sort: async (): Promise<T[]> => [this.entityStub],
    };
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }
}
