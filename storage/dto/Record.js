class Record {
  constructor({ location, timestamp, signature, material, data }) {
    this.location = location;
    this.timestamp = timestamp;
    this.signature = signature;
    this.material = material;
    this.data = data;
  }

  toSql() {
    return {
      location: this.location,
      timestamp: this.timestamp,
      signature: this.signature,
      material: this.material,
      a: this.data.a,
      b: this.data.b,
      c: this.data.c,
      d: this.data.d,
      create_time: new Date(),
      date: this.timestamp.split("T")[0],
    };
  }
}

module.exports = { Record };
