/* eslint-disable @typescript-eslint/no-explicit-any */
import { singleton } from '../lang/patterns/singleton';

@singleton
export class BroadcastChannelManager {
  private _channels: Map<string, BroadcastChannel> = new Map();

  constructor() {}

  public getChannel(channelName: string): BroadcastChannel {
    if (!this._channels.has(channelName)) {
      this._channels.set(channelName, new BroadcastChannel(channelName));
    }
    return this._channels.get(channelName)!;
  }

  public broadcast<
    T extends {
      msgType: string;
      data: unknown;
    } = any,
  >(channelName: string, message: T) {
    const channel = this.getChannel(channelName);
    channel.postMessage(message);
  }

  public onMessage<
    T extends {
      msgType: string;
      data: unknown;
    } = any,
  >(channelName: string, callback: (message: T) => void) {
    const channel = this.getChannel(channelName);
    const fn = (event: MessageEvent<T>) => {
      callback(event.data);
    };
    channel.addEventListener('message', fn);
    return () => {
      channel.removeEventListener('message', fn);
    }
  }

  dispose(channelName?: string) {
    if (channelName) {
      const channel = this._channels.get(channelName);
      if (channel) {
        channel.close();
        this._channels.delete(channelName);
      }
    } else {
      this._channels.forEach((channel) => {
        channel.close();
      });
      this._channels.clear();
    }
  }
}
