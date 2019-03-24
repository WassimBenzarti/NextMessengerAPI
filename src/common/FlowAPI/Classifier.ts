export default class Classifier {
  isValid = true;
  isAlwaysValid = false;
  result: any;
  changes: any = { intent: {} };
  constructor(private nlp?: any) {}
  setNlp(nlp) {
    this.nlp = nlp;
    return this;
  }
  getIntent(key) {
    return (
      this.nlp.intent && this.nlp.intent.find(intent => intent.value === key)
    );
  }
  or(bool: boolean) {
    this.isAlwaysValid = this.isValid;
    if (this.isValid) this.result = { ...this.result, ...this.changes };
    this.changes = {};
    this.isValid = typeof bool === "undefined" ? bool : true;
    return this;
  }
  hasIntent(key) {
    this.isValid = this.isValid && !!this.getIntent(key);
    if (this.isValid) this.changes.intent[key] = this.getIntent(key);
    return this;
  }
  trustIntent(key) {
    this.hasIntent(key);
    this.isValid = this.isValid && this.getIntent(key).confidence > 0.6;
    return this;
  }
  trust(key) {
    const entity = this.nlp[key] && this.nlp[key].find(e => e.confidence > 0.6);
    this.isValid = this.isValid && !!entity;
    if (this.isValid) this.changes[key] = entity;
    return this;
  }
  has(key) {
    const entity = this.nlp[key] && this.nlp[key][0];
    this.isValid = this.isValid && !!entity;
    if (this.isValid) this.changes[key] = entity;
    return this;
  }
  evaluate() {
    return this.isAlwaysValid || this.isValid;
  }
  getResult() {
    return this.result || this.changes;
  }
}
