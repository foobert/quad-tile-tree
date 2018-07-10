const tileTree = new QuadTileTree();

const CanvasLayer = L.GridLayer.extend({
  createTile: function(coord) {
    const size = this.getTileSize();

    const tile = L.DomUtil.create("canvas", "leaflet-tile");
    tile.width = size.x;
    tile.height = size.y;

    const pois = tileTree.get({ x: coord.x, y: coord.y, zoom: coord.z });
    const quadKey = toQuadKey(coord.x, coord.y, coord.z).join("");

    const ctx = tile.getContext("2d");

    // render pois
    for (const poi of pois) {
      const projected = this._map.project(poi, coord.z);
      const position = {
        x: projected.x % size.x,
        y: projected.y % size.y
      };
      ctx.beginPath();
      ctx.arc(position.x, position.y, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      // fancy colors :-D
      ctx.fillStyle = "#" + hex(poi.lat, 180) + hex(poi.lon, 360);
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
    }
    //
    // render some debugging info
    ctx.strokeStyle = "red";
    ctx.fillStyle = "black";
    ctx.strokeRect(0, 0, size.x, size.y);
    ctx.fillText(`x: ${coord.x} y: ${coord.y} z: ${coord.z}`, 10, 20);
    ctx.fillText(`quadkey: ${quadKey}`, 10, 35);
    ctx.fillText(`found pois: ${pois.length}`, 10, 50);

    return tile;
  }
});

const map = L.map("map").setView([0, 0], 3);

const layer = new CanvasLayer();
map.addLayer(layer);

// add some test data
for (let lat = -90; lat < 90; lat += 10) {
  for (let lon = -180; lon < 180; lon += 10) {
    tileTree.add({ lat, lon }, { lat, lon });
  }
}
layer.redraw();

function toQuadKey(tileX, tileY, zoom) {
  let quadKey = [];
  for (let i = zoom; i > 0; i--) {
    let digit = 0;
    const mask = 1 << (i - 1);
    if ((tileX & mask) !== 0) {
      digit++;
    }
    if ((tileY & mask) !== 0) {
      digit += 2;
    }
    quadKey.push(digit);
  }
  return quadKey;
}

function hex(number, range) {
  const x = Math.trunc((number + range / 2) / range * 4096).toString(16);
  switch (x.length) {
    case 1:
      return "00" + x;
    case 2:
      return "0" + x;
    default:
      return x;
  }
}
