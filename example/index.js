const mymap = L.map("mapid").setView([51.505, -0.09], 13);

const tileTree = new QuadTileTree();

for (let i = 0; i < 10000; i++) {
  const c = {
    lat: 51.524 + Math.random() - 0.5,
    lon: -0.1 + -0.5 + Math.random()
  };
  tileTree.add(c, { id: i, lat: c.lat, lon: c.lon });
}
const c = { id: 0, lat: 51.524, lon: -0.1 };
tileTree.add(c, c);

//L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//attribution: "foo",
//maxZoom: 18
//}).addTo(mymap);

const imageBig = document.getElementById("image");
const imageSmall = document.getElementById("image_small");

const CanvasLayer = L.GridLayer.extend({
  createTile: function(coord) {
    const size = this.getTileSize();

    const tile = L.DomUtil.create("canvas", "leaflet-tile");
    tile.width = size.x;
    tile.height = size.y;

    const coordinates = toCoordinates(coord);
    const coordinatesLowerRight = toCoordinates({
      x: coord.x + 1,
      y: coord.y + 1,
      z: coord.z
    });
    const gcs = tileTree.get({ x: coord.x, y: coord.y, zoom: coord.z });
    const quadKey = toQuadKey(coord.x, coord.y, coord.z).join("");

    const ctx = tile.getContext("2d");

    if (true) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(0, 0, size.x, size.y);

      ctx.fillStyle = "black";
      ctx.fillText(`x: ${coord.x} y: ${coord.y} z: ${coord.z}`, 10, 20);
      ctx.fillText(`size: ${size.x} x ${size.y}`, 10, 35);
      ctx.fillText(`lat: ${coordinates.lat} lon: ${coordinates.lon}`, 10, 50);
      ctx.fillText(`quad: ${quadKey}`, 10, 65);
    }

    for (const gc of gcs) {
      const position = {
        x:
          Math.sign(coordinates.lon) *
          (coordinates.lon - gc.lon) /
          Math.abs(coordinates.lon - coordinatesLowerRight.lon) *
          size.x,
        y:
          (coordinates.lat - gc.lat) /
          Math.abs(coordinates.lat - coordinatesLowerRight.lat) *
          size.y
      };

      //ctx.fillStyle = "blue";
      //ctx.fillRect(dx - 5, dy - 5, 10, 10);

      if (
        position.x < 0 ||
        position.x > size.x ||
        position.y < 0 ||
        position.y > size.y
      ) {
        continue;
      }

      const image = coord.z < 13 ? imageSmall : imageBig;
      const center = {
        x:
          Math.max(
            image.width / 2,
            Math.min(size.x - image.width / 2, position.x)
          ) -
          image.width / 2,
        y:
          Math.max(
            image.height / 2,
            Math.min(size.y - image.height / 2, position.y)
          ) -
          image.height / 2
      };

      ctx.drawImage(image, center.x, center.y);
    }

    return tile;
  }
});

mymap.addLayer(new CanvasLayer());

const canvas = document.getElementById("test");
const ctx = canvas.getContext("2d");
window.ctx = ctx;

function toCoordinates(tile) {
  const n = Math.pow(2, tile.z);
  const lon = tile.x / n * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * tile.y / n)));
  const lat = latRad / Math.PI * 180;
  return { lat, lon };
}

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

function toTile(lat, lon, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const xtile = parseInt((lon + 180.0) / 360.0 * n);
  const ytile = parseInt(
    (1.0 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
      2.0 *
      n
  );
  return { x: xtile, y: ytile };
}
