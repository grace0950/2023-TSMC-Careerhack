class Record {
  constructor({ location, timestamp, signature, material, data }) {
    this.location = location;
    this.timestamp = timestamp;
    this.signature = signature;
    this.material = material;
    this.data = data;
  }
}

module.exports = { Record };
