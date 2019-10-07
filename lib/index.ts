interface Meta<T> {
  calculatingStartsAt: number
  data: T
}

export class OnlyLast<T> {
  private storage: Array<Meta<T>> = []

  execute = async (calculate: () => Promise<T>): Promise<T> => {  
    const calculatingStartsAt = Date.now()
  
    const data = await calculate()
  
    const meta: Meta<T> = {
      calculatingStartsAt,
      data,
    }
  
    this.storage.push(meta)

    // TODO: add cleanup old results

    return this.lastResult
  }

  private get lastResult(): T | null {
    if (this.storage.length === 0) {
      return null;
    }
  
    let [head, ...rest] = this.storage
    for (const candidate of rest) {
      if (candidate.calculatingStartsAt > head.calculatingStartsAt) {
        head = candidate
      }
    }
  
    return head.data
  }
}
