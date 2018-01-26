import { IocContext } from 'power-di';
import { IStore } from './IStore';
import { MemoryStore } from './MemoryStore';

export class CacheConfig {
  /** seconds, -1: is not expired */
  expiredTime?: number = -1;
  /** refresh time of every get */
  autoRefresh?: boolean = true;
}

export interface ICacheData {
  value?: any;
  expireTime?: number;
  config: CacheConfig;
}

export class CacheManager {
  private store: IStore<ICacheData>;

  constructor(
    private ioc: IocContext = IocContext.DefaultInstance
  ) {
    this.store = ioc.get(IStore) || new MemoryStore;
    if (!ioc.get(CacheManager)) {
      ioc.register(this, CacheManager);
    }
  }

  async get(key: string) {
    const cacheData = await this.store.get(key);
    if (cacheData) {
      if (cacheData.expireTime === -1 || +Date.now() <= cacheData.expireTime) {
        if (cacheData.expireTime !== -1 && cacheData.config.autoRefresh) {
          this.put(key, cacheData.value, cacheData.config);
        }
        return cacheData.value;
      } else {
        await this.store.delete(key);
      }
    }
  }

  async put<T = any>(key: string, value: T, config: CacheConfig) {
    return this.store.put(key, {
      value,
      expireTime: config.expiredTime > 0 ? +Date.now() + config.expiredTime * 1000 : -1,
      config
    });
  }

  async has(key: string) {
    return await this.store.has(key);
  }

  async delete(key: string) {
    return await this.store.delete(key);
  }
}
