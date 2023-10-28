import 'reflect-metadata';

import { AsyncServiceBase, ServiceBase, afterInit, initRequired } from './base-service';

describe('ServiceBase', () => {
  test('should throw error when dispose method is called', () => {
    class Test extends ServiceBase {
      constructor() {
        super();
      }
    }
    const service = new Test();
    expect(() => {
      service.dispose();
    }).toThrow();
  });

  test('should have uid for service', () => {
    class Test extends ServiceBase {
      constructor() {
        super();
      }
    }
    const service = new Test();
    expect(service.uid).toBeDefined();
  });
});

describe('AsyncServiceBase', () => {
  let service: AsyncServiceBase;

  beforeEach(() => {
    class AsyncServiceBaseR extends AsyncServiceBase {
      constructor() {
        super();
      }
    }
    service = new AsyncServiceBaseR();
  });

  afterEach(() => {
    service.dispose();
  });

  test('should initialize the service and set ready flag to true', async () => {
    expect(service.isReady()).toBe(false);
    await service.init();
    expect(service.isReady()).toBe(true);
  });

  test('should emit ready event when service is initialized', async () => {
    const readyCallback = jest.fn();
    // @ts-ignore
    service._emitter.on('ready', readyCallback);

    expect(readyCallback).not.toHaveBeenCalled();
    await service.init();
    expect(readyCallback).toHaveBeenCalled();
  });

  test('should throw error when a method is called before initialization', async () => {
    const method = jest.fn();
    class Demo extends AsyncServiceBase {
      constructor() {
        super();
      }

      @initRequired()
      methodTest() {
        return method();
      }
    }
    const demoService = new Demo();
    expect(method).not.toHaveBeenCalled();
    await demoService.init();
    // @ts-ignore
    demoService.methodTest();
    expect(method).toHaveBeenCalled();
  });

  test('should remove all listeners when dispose method is called', async () => {
    const readyCallback = jest.fn();
    // @ts-ignore
    service._emitter.on('ready', readyCallback);

    expect(readyCallback).not.toHaveBeenCalled();
    await service.init();
    expect(readyCallback).toHaveBeenCalled();

    service.dispose();
    // @ts-ignore
    expect(service._emitter.listenerCount('ready')).toBe(0);
  });

  test('should work with onReady method', async () => {
    const method = jest.fn();
    class Demo extends AsyncServiceBase {
      constructor() {
        super();
        this.init();
      }

      async init() {
        return super.init();
      }

      methodTest() {
        return method();
      }
    }
    const demoService = new Demo();
    await demoService.onReady();
    // @ts-ignore
    demoService.methodTest();
    expect(method).toHaveBeenCalled();
  });
});

describe('afterInit', () => {
  it('should follow the base logics when service is not ready', async () => {
    const method = jest.fn();
    class Demo extends AsyncServiceBase {
      constructor() {
        super();
      }

      async init() {
        await super.init();
      }

      // @ts-ignore
      @afterInit()
      async methodTest() {
        return method();
      }
    }
    const demoService = new Demo();
    demoService.methodTest();
    expect(method).not.toHaveBeenCalled();
    await demoService.init();
    // @ts-ignore
    demoService.methodTest();
    expect(method).toHaveBeenCalled();
  });

  it('should throw error when service is not ready till the timeout', async () => {
    const method = jest.fn();
    class Demo extends AsyncServiceBase {
      constructor() {
        super();
      }

      async init() {
        await super.init();
      }

      // @ts-ignore
      @afterInit({ timeout: 100 })
      async methodTest() {
        return method();
      }
    }
    const demoService = new Demo();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        demoService.methodTest().catch((e) => {
          expect(e.message).toBe('[afterInit] Service is not ready, please call init() first.');
          resolve(true);
        });
      }, 200);
    });
  });
});
