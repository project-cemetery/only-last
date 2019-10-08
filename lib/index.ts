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

    const lastResult = this.getLastResult();
    if (!lastResult) {
      return data;
    }

    this.cleanup();

    return lastResult.data;
  };

  private getLastResult(): Meta<T> | null {
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
    const lastResult = this.getLastResult();
    if (!lastResult) {
      return;
    }

    const { calculatingStartsAt } = lastResult;

    this.storage = this.storage.filter(
      item => item.calculatingStartsAt >= calculatingStartsAt,
    );
  };
}
