import { singleton, SINGLETON_KEY } from './singleton';

describe('singleton', () => {
  class MyClass { }

  it('should return the same instance', () => {
    const SingletonMyClass = singleton(MyClass);

    const instance1 = new SingletonMyClass();
    const instance2 = new SingletonMyClass();

    expect(instance1).toBe(instance2);
  });

  it('should store the instance in the [SINGLETON_KEY] property', () => {
    const SingletonMyClass = singleton(MyClass);

    const instance = new SingletonMyClass();

    expect((SingletonMyClass as any)[SINGLETON_KEY] as any).toBe(instance);
  });

  it('should skip proxy for children', () => {
    class ChildClass extends MyClass {
      constructor() {
        super();
      }

      hey() {}
    }

    const SingletonChildClass = singleton(ChildClass);

    const instance = new SingletonChildClass();

    expect(instance).toBeInstanceOf(MyClass);
    expect((SingletonChildClass as any)[SINGLETON_KEY] as any).toBeTruthy();
  });
});