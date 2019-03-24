import { Expirationable, IMap } from ".";

export default class OneTimeMap<V> implements IMap<string, V> {
  private store: { [k: string]: Expirationable<V> } = {};

  constructor(
    private getExpirationDate: (value: V) => number = () => {
      let date = new Date();
      date.setHours(date.getHours() + 1);
      return date.getTime();
    }
  ) {}

  isExpired(obj: Expirationable<V>) {
    return obj.expirationDate < new Date().getTime();
  }
  put(key: string, value: V) {
    if (!key) throw new Error("Key is missing");
    if (!value) throw new Error("value is missing");
    this.store[key] = {
      expirationDate: this.getExpirationDate(value),
      data: value
    };
  }
  get(key: string): V | null {
    if (!key) throw new Error("Key is missing");
    const obj = this.store[key];
    if (!obj || this.isExpired(obj)) {
      return null;
    }
    const data = obj.data;
    delete this.store[key];
    return data;
  }
}
