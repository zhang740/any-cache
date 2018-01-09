export abstract class IStore<T = any> {
  abstract async get(key: string): Promise<T | undefined>;
  abstract async has(key: string): Promise<boolean>;
  abstract async put(key: string, value: T): Promise<boolean>;
  abstract async delete(key: string): Promise<T | undefined>;
}
