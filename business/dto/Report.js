class Report {
  constructor(records) {
    this.location = records[0].location;
    this.date = records[0].timestamp.split("T")[0];
    this.count = records.length;
    this.material = records.reduce((acc, cur) => acc + cur.material, 0);
    this.a = records.reduce((acc, cur) => acc + cur.a, 0);
    this.b = records.reduce((acc, cur) => acc + cur.b, 0);
    this.c = records.reduce((acc, cur) => acc + cur.c, 0);
    this.d = records.reduce((acc, cur) => acc + cur.d, 0);
  }
}

module.exports = { Report };
