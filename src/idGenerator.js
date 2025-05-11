export default class IdGenerator {
  constructor(start = 0) {
    this.counter = start;
  }

  generate() {
    this.counter += 1;
    return this.counter; // "0001"
  }
}
