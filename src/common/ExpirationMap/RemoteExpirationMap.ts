import ExpirationMap, { Expirationable, IMap } from "./ExpirationMap";

export interface RemoteEntity<V> {
  setData(key: string, value: V);
  getData(key: string);
}

export default class RemoteExpirationMap<V> extends ExpirationMap<V> {
  constructor(
    protected remoteEntity: RemoteEntity<Expirationable<V>>,
    protected getExpirationDate: (value: V) => number
  ) {
    super(getExpirationDate);
  }

  async put(key: string, value: V) {
    if (!key) throw new Error("Key is missing");
    if (!value) throw new Error("value is missing");
    await this.remoteEntity.setData(key, {
      expirationDate: this.getExpirationDate(value),
      data: value
    });
  }

  async get(key: string) {
    if (!key) throw new Error("Key is missing");
    const obj = await this.remoteEntity.getData(key);
    if (!obj || this.isExpired(obj)) {
      return null;
    }
    return obj.data;
  }
}
