import { IocContext } from 'power-di';
import { CacheManager, CacheConfig } from './CacheManager';

export type CacheKeyType = ((...args: any[]) => string) | string;

export class Decorators {

  constructor(
    private ioc: IocContext = IocContext.DefaultInstance,
    private cacheManager?: CacheManager
  ) {
  }

  public cachePut(cacheKey: CacheKeyType, config?: CacheConfig) {
    config = { ...new CacheConfig, ...config };
    const cacheManager = this.getCacheManager();

    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>): any {
      const fn: Function = target[key];
      return {
        configurable: true,
        get: () => async function (...args: any[]) {
          const finalKey = typeof cacheKey === 'string' ? cacheKey : cacheKey(...args);
          let data = await cacheManager.get(finalKey);
          if (data === undefined && !await cacheManager.has(finalKey)) {
            data = await fn.apply(target, args);
            await cacheManager.put(finalKey, data, config);
          }
          return data;
        }
      };
    };
  }

  public cacheEvict(cacheKey: CacheKeyType | CacheKeyType[]) {
    const cacheManager = this.getCacheManager();

    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>): any {
      const fn: Function = target[key];
      return {
        configurable: true,
        get: () => async function (...args: any[]) {
          const data = await fn.apply(target, args);

          if (!(cacheKey instanceof Array)) {
            cacheKey = [cacheKey];
          }
          cacheKey.forEach(ck => {
            const finalKey = typeof ck === 'string' ? ck : ck(...args);
            cacheManager.delete(finalKey);
          });
          return data;
        }
      };
    };
  }

  private getCacheManager = () => this.cacheManager || this.ioc.get<CacheManager>(CacheManager);
}

export function getDecorators(ioc: IocContext = IocContext.DefaultInstance, cacheManager?: CacheManager) {
  if (!cacheManager && !ioc.get(CacheManager)) {
    ioc.register(CacheManager);
  }
  return new Decorators(ioc, cacheManager);
}
