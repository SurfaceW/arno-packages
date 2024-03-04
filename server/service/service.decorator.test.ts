import { WithServiceResult } from './service.decorator';
import { ServiceResult } from './service.result';

class TestClass {
  @WithServiceResult()
  async successMethod() {
    return 'success';
  }

  @WithServiceResult({
    catchFn: (error) => new ServiceResult(false, 'custom error', error),
  })
  async failureMethod() {
    throw new Error('failure');
  }
}

describe('WithServiceResult', () => {
  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
  });

  it('should return a successful ServiceResult when the method succeeds', async () => {
    const result = await instance.successMethod();
    expect(result).toEqual(new ServiceResult(true, 'ok', 'success'));
  });

  it('should return a failed ServiceResult with a custom error when the method fails', async () => {
    try {
      await instance.failureMethod();
    } catch (result) {
      expect(result).toEqual(new ServiceResult(false, 'custom error', new Error('failure')));
    }
  });
});