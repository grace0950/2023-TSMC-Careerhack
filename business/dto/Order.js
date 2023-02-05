class Order {
  constructor({ location, timestamp, data, createTime }) {
    this.location = location;
    this.timestamp = timestamp;
    this.data = data;
    this.createTime = createTime;
  }
}

module.exports = { Order };
