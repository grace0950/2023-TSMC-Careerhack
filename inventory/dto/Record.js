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
    this.a = order.data.a;
    this.b = order.data.b;
    this.c = order.data.c;
    this.d = order.data.d;
    this.material =
      this.a * inventoryMap.get("a") +
      this.b * inventoryMap.get("b") +
      this.c * inventoryMap.get("c") +
      this.d * inventoryMap.get("d");
    this.signature = Buffer.from(
      (this.a + this.b + this.c + this.d).toString()
    ).toString("base64");
    this.createTime = order.createTime;
  }
}

module.exports = { Record };
