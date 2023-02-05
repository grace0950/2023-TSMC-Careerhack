class Record {
  constructor({
    location,
    timestamp,
    signature,
    material,
    a,
    b,
    c,
    d,
    createTime,
  }) {
    this.location = location;
    this.timestamp = timestamp;
    this.signature = signature;
    this.material = material;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.createTime = createTime;
  }
}

module.exports = { Record };
