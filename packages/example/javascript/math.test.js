const assert = require("assert");
const math = require("./math");

describe("math", () => {
  describe(".sum()", () => {
    it("should return correct value", () => {
      assert.equal(math.sum(1, 2), 3);
      assert.equal(math.sum(5, 5), 10);
    });
  });
});
