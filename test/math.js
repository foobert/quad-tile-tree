/* eslint-env mocha */

//import { expect } from "chai";

import { toTile, toQuadKey } from "../src/math";

describe("toTile", () => {
  it("should translate coordinates to a tile", () => {
    let { x, y } = toTile(0, 0, 11);
    expect(x).toBe(1024);
    expect(y).toBe(1024);
  });

  it("should translate coordinates to a tile", () => {
    let { x, y } = toTile(52.512612, 13.387648, 12);
    expect(x).toBe(2200);
    expect(y).toBe(1343);
  });
});

describe("toQuadKey", () => {});
