import { RemoteEntity } from "../../common/ExpirationMap";

export default class FirestoreEntity<T> implements RemoteEntity<T> {
  constructor(private firestore: any) {}

  setData(key: string, value: T) {
    console.log("FirebaseEntity setting: ", key, value);
    return this.firestore.doc(key).set(value, { merge: true });
  }
  getData(key: string) {
    return this.firestore
      .doc(key)
      .get()
      .then(doc => {
        return doc.exists ? doc.data() : null;
      })
      .catch(err =>
        console.log("YO! things are not going well with firestore!", err)
      );
  }
}
