class Order {
  constructor({ location, timestamp, data }) {
    this.location = location;
    this.timestamp = timestamp;
    this.data = data;
  }
}

module.exports = { Order };
