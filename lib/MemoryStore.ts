import { IStore } from './IStore';

export class MemoryStore<T = any> extends IStore<T> {
  private data = new Map<string, T>();

  async get(key: string): Promise<T> {
    const data = this.data.get(key);
    return data && typeof data === 'object' ? { ...data as any } : data;
  }

  async has(key: string): Promise<boolean> {
    return this.data.has(key);
  }

  async put(key: string, value: T): Promise<boolean> {
    this.data.set(key, value);
    return true;
  }

  async delete(key: string): Promise<T> {
    const value = this.data.get(key);
    this.data.delete(key);
    return value;
  }
}
