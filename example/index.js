const mymap = L.map("mapid").setView([51.505, -0.09], 13);

//L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//attribution: "foo",
//maxZoom: 18
//}).addTo(mymap);

const imageBig = document.getElementById("image");
const imageSmall = document.getElementById("image_small");

const CanvasLayer = L.GridLayer.extend({
  tileTree: new QuadTileTree(),
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
    const gcs = this.tileTree.get({ x: coord.x, y: coord.y, zoom: coord.z });
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
  },
  popup: L.popup(),
  onClick: function(e) {
    const { lat, lng: lon } = e.latlng;
    const tile = toTile(lat, lon, mymap.getZoom());
    const gcs = this.tileTree.get({
      x: tile.x,
      y: tile.y,
      zoom: mymap.getZoom()
    });
    const filtered = gcs
      .map(gc => ({
        dist: Math.abs(lat - gc.lat) + Math.abs(lon - gc.lon),
        gc
      }))
      .filter(x => x.dist < 0.005)
      .sort((a, b) => a.dist - b.dist)
      .map(({ gc }) => gc);
    if (filtered.length > 0) {
      const closest = filtered[0];
      this.popup
        .setLatLng({ lat: closest.lat, lng: closest.lon })
        .setContent(closest.id.toString())
        .openOn(mymap);
    }
  }
});

const layer = new CanvasLayer();

for (let i = 0; i < 10000; i++) {
  const c = {
    lat: 51.524 + Math.random() - 0.5,
    lon: -0.1 + -0.5 + Math.random()
  };
  layer.tileTree.add(c, { id: i, lat: c.lat, lon: c.lon });
}
mymap.addLayer(layer);

mymap.on("click", e => layer.onClick(e));

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
