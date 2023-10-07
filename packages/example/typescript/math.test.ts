import assert from "assert";
import { sum } from "./math";

describe("math", () => {
  describe(".sum()", () => {
    it("should return correct value", () => {
      assert.equal(sum(1, 2), 3);
      assert.equal(sum(5, 5), 10);
    });
  });
});
