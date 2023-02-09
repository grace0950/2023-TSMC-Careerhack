class Record {
  constructor({ location, timestamp, signature, material, a, b, c, d }) {
    this.location = location;
    this.timestamp = timestamp;
    this.signature = signature;
    this.material = material;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  toSql() {
    return {
      location: this.location,
      timestamp: this.timestamp,
      signature: this.signature,
      material: this.material,
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      date: this.timestamp.split("T")[0],
    };
  }
}

module.exports = { Record };
