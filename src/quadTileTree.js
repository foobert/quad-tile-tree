//import createDebug from "debug";
import { toTile, toQuadKey } from "./math";

//const debug = createDebug("quad-tile-tree");

const debug = () => {};

export default class QuadTileTree {
  constructor(maxZoom = 16) {
    this.root = [];
    this.zoom = maxZoom;
  }

  add({ lat, lon }, data) {
    const tile = toTile(lat, lon, this.zoom);
    const quadKey = toQuadKey(tile.x, tile.y, this.zoom);

    debug("add at %s", quadKey.join(""));

    let currentNode = this.root;
    for (const k of quadKey) {
      if (!currentNode[k]) {
        currentNode[k] = [];
      }
      currentNode = currentNode[k];
    }
    currentNode.leaf = true;
    currentNode.path = quadKey.join("");
    currentNode.push(data);
    return quadKey.join("");
  }

  get(opts) {
    return [...this.getIterator(opts)];
  }

  *getIterator({ x, y, zoom }) {
    const quadKey = toQuadKey(x, y, zoom).slice(0, this.zoom);

    debug("get at %s", quadKey.join(""));
    let currentNode = this.root;
    for (const k of quadKey) {
      if (!currentNode[k]) {
        debug("empty node");
        return;
      }
      currentNode = currentNode[k];
    }

    // now we need to walk the rest of the tree and return everything
    let queue = [currentNode];

    for (;;) {
      if (queue.length === 0) {
        break;
      }

      let n = queue.shift();
      if (!n) {
        continue;
      }
      //debug("walk n: %o", n);
      if (n.leaf) {
        debug("leaf at %s with %d item(s)", n.path, n.length);
        //result = result.concat(n);
        yield* n;
      } else {
        queue = queue.concat(Object.values(n));
      }
    }
  }
}
