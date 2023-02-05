class Result {
  constructor({ affectedRows }) {
    this.ok = affectedRows > 0;
  }
}

module.exports = { Result };
