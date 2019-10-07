import { OnlyLast } from '../index';

const getValueAfterDelay = <T>(value: T, delay: number = 100) =>
  new Promise(resolve => setTimeout(() => resolve(value), delay));
const delay = (ms: number = 100) =>
  new Promise(resolve => setTimeout(resolve, ms));

describe('onlyLast', () => {
  test('should return one value for one call', async () => {
    const executor = new OnlyLast();

    const result = await executor.execute(() => getValueAfterDelay(1));

    expect(result).toBe(1);
  });

  test('should return second value for two calls', async () => {
    const executor = new OnlyLast();

    const result1Promise = executor.execute(() => getValueAfterDelay(1, 1000));
    await delay(100);
    const result2Promise = executor.execute(() => getValueAfterDelay(2, 100));

    const [result1, result2] = await Promise.all([
      result1Promise,
      result2Promise,
    ]);

    expect(result1).toBe(2);
    expect(result2).toBe(2);
  });

  test('should return last value for many calls', async () => {
    const executor = new OnlyLast();

    const result1Promise = executor.execute(() => getValueAfterDelay(1, 1000));
    await delay(100);
    const result2Promise = executor.execute(() => getValueAfterDelay(2, 1000));
    await delay(100);
    const result3Promise = executor.execute(() => getValueAfterDelay(3, 100));

    const [result1, result2, result3] = await Promise.all([
      result1Promise,
      result2Promise,
      result3Promise,
    ]);

    expect(result1).toBe(3);
    expect(result2).toBe(3);
    expect(result3).toBe(3);
  });
});
