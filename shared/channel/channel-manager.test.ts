/* eslint-disable @typescript-eslint/no-explicit-any */
import { BroadcastChannelManager } from './channel-manager';

// Mock BroadcastChannel
class MockBroadcastChannel {
  public name: string;
  private listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();
  private static instances: Map<string, MockBroadcastChannel> = new Map();

  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.instances.set(name, this);
  }

  postMessage(data: any) {
    // Simulate broadcasting to all channels with the same name
    const channel = MockBroadcastChannel.instances.get(this.name);
    if (channel) {
      const messageListeners = channel.listeners.get('message') || [];
      messageListeners.forEach(listener => {
        listener(new MessageEvent('message', { data }));
      });
    }
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      const index = typeListeners.indexOf(listener);
      if (index > -1) {
        typeListeners.splice(index, 1);
      }
    }
  }

  close() {
    this.listeners.clear();
    MockBroadcastChannel.instances.delete(this.name);
  }

  static clearAll() {
    MockBroadcastChannel.instances.clear();
  }
}

// Mock the global BroadcastChannel
(global as any).BroadcastChannel = MockBroadcastChannel;

describe('BroadcastChannelManager', () => {
  let manager: BroadcastChannelManager;

  beforeEach(() => {
    // Clear all mock instances
    MockBroadcastChannel.clearAll();
    // Create new manager instance
    manager = new BroadcastChannelManager();
  });

  afterEach(() => {
    // Clean up after each test
    manager.dispose();
    MockBroadcastChannel.clearAll();
  });

  describe('getChannel', () => {
    it('should create a new channel if it does not exist', () => {
      const channelName = 'test-channel';
      const channel = manager.getChannel(channelName);
      
      expect(channel).toBeInstanceOf(MockBroadcastChannel);
      expect((channel as any).name).toBe(channelName);
    });

    it('should return the same channel instance for the same channel name', () => {
      const channelName = 'test-channel';
      const channel1 = manager.getChannel(channelName);
      const channel2 = manager.getChannel(channelName);
      
      expect(channel1).toBe(channel2);
    });

    it('should create different channels for different channel names', () => {
      const channel1 = manager.getChannel('channel-1');
      const channel2 = manager.getChannel('channel-2');
      
      expect(channel1).not.toBe(channel2);
      expect((channel1 as any).name).toBe('channel-1');
      expect((channel2 as any).name).toBe('channel-2');
    });
  });

  describe('broadcast', () => {
    it('should broadcast a message to the specified channel', () => {
      const channelName = 'test-channel';
      const message = { msgType: 'test', data: 'hello world' };
      
      const channel = manager.getChannel(channelName);
      const postMessageSpy = jest.spyOn(channel, 'postMessage');
      
      manager.broadcast(channelName, message);
      
      expect(postMessageSpy).toHaveBeenCalledWith(message);
      expect(postMessageSpy).toHaveBeenCalledTimes(1);
    });

    it('should create channel if it does not exist when broadcasting', () => {
      const channelName = 'new-channel';
      const message = { msgType: 'test', data: 'hello' };
      
      // Channel should not exist initially
      expect((manager as any)._channels.has(channelName)).toBe(false);
      
      manager.broadcast(channelName, message);
      
      // Channel should be created
      expect((manager as any)._channels.has(channelName)).toBe(true);
    });

    it('should handle different message types', () => {
      const channelName = 'test-channel';
      const messages = [
        { msgType: 'user-action', data: { action: 'click', element: 'button' } },
        { msgType: 'system-event', data: { event: 'error', code: 500 } },
        { msgType: 'notification', data: 'Task completed successfully' }
      ];
      
      const channel = manager.getChannel(channelName);
      const postMessageSpy = jest.spyOn(channel, 'postMessage');
      
      messages.forEach(message => {
        manager.broadcast(channelName, message);
      });
      
      expect(postMessageSpy).toHaveBeenCalledTimes(3);
      messages.forEach(message => {
        expect(postMessageSpy).toHaveBeenCalledWith(message);
      });
    });
  });

  describe('onMessage', () => {
    it('should register a message listener for the specified channel', () => {
      const channelName = 'test-channel';
      const callback = jest.fn();
      
      const channel = manager.getChannel(channelName);
      const addEventListenerSpy = jest.spyOn(channel, 'addEventListener');
      
      manager.onMessage(channelName, callback);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the callback when a message is received', () => {
      const channelName = 'test-channel';
      const callback = jest.fn();
      const message = { msgType: 'test', data: 'hello world' };
      
      manager.onMessage(channelName, callback);
      manager.broadcast(channelName, message);
      
      expect(callback).toHaveBeenCalledWith(message);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a cleanup function that removes the event listener', () => {
      const channelName = 'test-channel';
      const callback = jest.fn();
      
      const channel = manager.getChannel(channelName);
      const removeEventListenerSpy = jest.spyOn(channel, 'removeEventListener');
      
      const cleanup = manager.onMessage(channelName, callback);
      
      expect(typeof cleanup).toBe('function');
      
      cleanup();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call callback after cleanup function is called', () => {
      const channelName = 'test-channel';
      const callback = jest.fn();
      const message = { msgType: 'test', data: 'hello world' };
      
      const cleanup = manager.onMessage(channelName, callback);
      
      // Message should trigger callback
      manager.broadcast(channelName, message);
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Cleanup
      cleanup();
      
      // Message should not trigger callback after cleanup
      manager.broadcast(channelName, message);
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should handle multiple listeners on the same channel', () => {
      const channelName = 'test-channel';
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const message = { msgType: 'test', data: 'hello world' };
      
      manager.onMessage(channelName, callback1);
      manager.onMessage(channelName, callback2);
      
      manager.broadcast(channelName, message);
      
      expect(callback1).toHaveBeenCalledWith(message);
      expect(callback2).toHaveBeenCalledWith(message);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should create channel if it does not exist when adding listener', () => {
      const channelName = 'new-channel';
      const callback = jest.fn();
      
      // Channel should not exist initially
      expect((manager as any)._channels.has(channelName)).toBe(false);
      
      manager.onMessage(channelName, callback);
      
      // Channel should be created
      expect((manager as any)._channels.has(channelName)).toBe(true);
    });
  });

  describe('dispose', () => {
    it('should dispose a specific channel when channel name is provided', () => {
      const channelName = 'test-channel';
      const channel = manager.getChannel(channelName);
      const closeSpy = jest.spyOn(channel, 'close');
      
      // Verify channel exists
      expect((manager as any)._channels.has(channelName)).toBe(true);
      
      manager.dispose(channelName);
      
      // Verify channel is closed and removed
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect((manager as any)._channels.has(channelName)).toBe(false);
    });

    it('should dispose all channels when no channel name is provided', () => {
      const channel1 = manager.getChannel('channel-1');
      const channel2 = manager.getChannel('channel-2');
      const channel3 = manager.getChannel('channel-3');
      
      const closeSpy1 = jest.spyOn(channel1, 'close');
      const closeSpy2 = jest.spyOn(channel2, 'close');
      const closeSpy3 = jest.spyOn(channel3, 'close');
      
      // Verify channels exist
      expect((manager as any)._channels.size).toBe(3);
      
      manager.dispose();
      
      // Verify all channels are closed and removed
      expect(closeSpy1).toHaveBeenCalledTimes(1);
      expect(closeSpy2).toHaveBeenCalledTimes(1);
      expect(closeSpy3).toHaveBeenCalledTimes(1);
      expect((manager as any)._channels.size).toBe(0);
    });

    it('should handle disposing non-existent channel gracefully', () => {
      const nonExistentChannel = 'non-existent-channel';
      
      expect(() => {
        manager.dispose(nonExistentChannel);
      }).not.toThrow();
      
      expect((manager as any)._channels.has(nonExistentChannel)).toBe(false);
    });

    it('should handle disposing when no channels exist', () => {
      expect((manager as any)._channels.size).toBe(0);
      
      expect(() => {
        manager.dispose();
      }).not.toThrow();
      
      expect((manager as any)._channels.size).toBe(0);
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance when created multiple times', () => {
      const manager1 = new BroadcastChannelManager();
      const manager2 = new BroadcastChannelManager();
      
      expect(manager1).toBe(manager2);
    });

    it('should maintain state across multiple instantiations', () => {
      const manager1 = new BroadcastChannelManager();
      const channelName = 'test-channel';
      
      // Create channel with first instance
      const channel1 = manager1.getChannel(channelName);
      
      // Create second instance
      const manager2 = new BroadcastChannelManager();
      const channel2 = manager2.getChannel(channelName);
      
      // Should be the same channel since it's the same singleton instance
      expect(channel1).toBe(channel2);
    });
  });

  describe('type safety', () => {
    it('should work with typed messages', () => {
      interface TestMessage {
        msgType: 'test-type';
        data: {
          id: number;
          name: string;
        };
      }
      
      const channelName = 'typed-channel';
      const callback = jest.fn<void, [TestMessage]>();
      const message: TestMessage = {
        msgType: 'test-type',
        data: { id: 1, name: 'test' }
      };
      
      manager.onMessage<TestMessage>(channelName, callback);
      manager.broadcast<TestMessage>(channelName, message);
      
      expect(callback).toHaveBeenCalledWith(message);
    });

    it('should work with default any type', () => {
      const channelName = 'any-channel';
      const callback = jest.fn();
      const message = { msgType: 'any-type', data: 'any data' };
      
      manager.onMessage(channelName, callback);
      manager.broadcast(channelName, message);
      
      expect(callback).toHaveBeenCalledWith(message);
    });
  });
}); 