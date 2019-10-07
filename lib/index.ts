interface Meta<T> {
  calculatingStartsAt: number;
  data: T;
}

export class OnlyLast<T> {
  private storage: Array<Meta<T>> = [];

  execute = async (calculate: () => Promise<T>): Promise<T> => {
    const calculatingStartsAt = Date.now();

    const data = await calculate();

    const meta: Meta<T> = {
      calculatingStartsAt,
      data,
    };

    this.storage.push(meta);

    if (!this.lastResult) {
      return data;
    }

    return this.lastResult.data;
  };

  private get lastResult(): Meta<T> | null {
    if (this.storage.length === 0) {
      return null;
    }

    // eslint-disable-next-line prefer-const
    let [head, ...rest] = this.storage;
    for (const candidate of rest) {
      if (candidate.calculatingStartsAt > head.calculatingStartsAt) {
        head = candidate;
      }
    }

    return head;
  }

  private cleanup = () => {
    if (!this.lastResult) {
      return;
    }

    const { calculatingStartsAt } = this.lastResult;

    this.storage = this.storage.filter(
      item => item.calculatingStartsAt < calculatingStartsAt,
    );
  };
}
