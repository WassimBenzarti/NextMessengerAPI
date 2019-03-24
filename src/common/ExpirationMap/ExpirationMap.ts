export interface IMap<K, V> {
  put(key: K, value: V): any;
  get(key: K): any;
}
export interface Expirationable<V> {
  expirationDate: number;
  data: V;
}

export default class ExpirationMap<V> implements IMap<string, V> {
  private store: { [k: string]: Expirationable<V> } = {};

  constructor(protected getExpirationDate: (value: V) => number) {}

  protected isExpired(obj: Expirationable<V>) {
    return obj.expirationDate < new Date().getTime();
  }

  async put(key: string, value: V) {
    if (!key) throw new Error("Key is missing");
    if (!value) throw new Error("value is missing");
    this.store[key] = {
      expirationDate: this.getExpirationDate(value),
      data: value
    };
  }

  async get(key: string) {
    if (!key) throw new Error("Key is missing");
    const obj = this.store[key];
    if (!obj || this.isExpired(obj)) {
      return null;
    }
    return obj.data;
  }
}
