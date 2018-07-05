/* eslint-env mocha */

import { expect } from "chai";
import QuadTileTree from "../src/quadTileTree";

describe("QuadTileTree", () => {
  const foo = { id: "foo" };
  const bar = { id: "bar" };
  const baz = { id: "baz" };

  it("should perform the quickstart example", () => {
    let tree = new QuadTileTree();

    tree.add({ lat: 50, lon: -10 }, foo);
    tree.add({ lat: 50, lon: -30 }, bar);
    tree.add({ lat: 50, lon: -50 }, baz);
    const result = tree.get({ x: 3, y: 2, zoom: 3 });

    expect(result).to.have.members([foo, bar]);
  });

  it("should fallback to max zoom", () => {
    let tree = new QuadTileTree();

    // this should be in tile 59326, 39500 at zoom 17
    tree.add({ lat: 57.966, lon: -17.055 }, foo);
    const result = tree.get({ x: 59326, y: 39500, zoom: 17 });

    expect(result).to.have.members([foo]);
  });

  it("should return an empty array for empty tiles", () => {
    let tree = new QuadTileTree();

    tree.add({ lat: 50, lon: -50 }, foo);
    const result = tree.get({ x: 3, y: 2, zoom: 3 });

    expect(result).to.be.empty;
  });

  it("should return an empty array for an empty tree", () => {
    let tree = new QuadTileTree();
    expect(tree.get({ x: 0, y: 0, zoom: 1 })).to.be.empty;
  });

  it("should return all items for zoom 0", () => {
    let tree = new QuadTileTree();

    tree.add({ lat: -50, lon: -10 }, foo);
    tree.add({ lat: 50, lon: 100 }, bar);
    tree.add({ lat: 0, lon: -50 }, baz);
    const result = tree.get({ x: 0, y: 0, zoom: 0 });

    expect(result).to.have.members([foo, bar, baz]);
  });

  it("should return something for negative zooms", () => {
    let tree = new QuadTileTree();
    expect(tree.get({ x: 0, y: 0, zoom: -1 })).to.be.empty;
  });

  it("should return all items in a leaf", () => {
    let tree = new QuadTileTree();

    tree.add({ lat: 50, lon: -10 }, foo);
    tree.add({ lat: 50, lon: -10 }, bar);
    tree.add({ lat: 50, lon: -50 }, baz);
    const result = tree.get({ x: 3, y: 2, zoom: 3 });

    expect(result).to.have.members([foo, bar]);
  });
});
