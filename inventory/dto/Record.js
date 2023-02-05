const inventoryMap = new Map([
  ["a", 3],
  ["b", 2],
  ["c", 4],
  ["d", 10],
]);

class Record {
  constructor(order) {
    this.location = order.location;
    this.timestamp = order.timestamp;
    this.data = order.data;
    this.material = Object.keys(order.data).reduce(
      (acc, key) => acc + order.data[key] * inventoryMap.get(key),
      0
    );
    this.signature = Buffer.from(
      Object.keys(order.data)
        .reduce((acc, key) => acc + order.data[key], 0)
        .toString()
    ).toString("base64");
  }
}

module.exports = { Record };
