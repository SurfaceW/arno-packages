import { GlobalRef, getGlobalRefMap, GlobalRefClassDecorator } from './global-ref';

describe('GlobalRef', () => {
  let globalRef: GlobalRef<number>;

  beforeEach(() => {
    globalRef = new GlobalRef('test');
  });

  test('should set and get value correctly', () => {
    const expectedValue = 123;
    globalRef.value = expectedValue;
    expect(globalRef.value).toEqual(expectedValue);
  });

  test('should print reference map correctly', () => {
    const spy = jest.spyOn(console, 'log');
    globalRef.printRefMap();
    expect(spy).toHaveBeenCalled();
  });

  test('should get global reference map correctly', () => {
    expect(getGlobalRefMap()).toBeInstanceOf(Map);
  });
});

describe('GlobalRefClassDecorator', () => {
  test('should return a constructor function', () => {
    const TestClass = GlobalRefClassDecorator('test1')(class {
      public value: string = 'test-static';
    });
    expect(TestClass).toBeInstanceOf(Function);
    const ins = new TestClass();
    expect(ins?.value).toBe('test-static');
  });

  test('should create a global singleton instance of the class', () => {
    const TestClass = GlobalRefClassDecorator('test2')(class Sample {
      public value: string = 'test';
      constructor(value: any) {
        if (value) {
          this.value = value;
        }
      }
    });

    const instance1 = new TestClass('bibi');
    const instance2 = new TestClass('bobo');

    expect(instance1).toStrictEqual(instance2);
    expect(instance1.value).toEqual('bibi');
  });
});
