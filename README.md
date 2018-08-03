# Fast POI lookup via Quad-Tile Trees

This is an implementation of a quad tile tree. It can be used to quickly lookup
POIs for representation on a map.

The idea is based of [an article by
OpenStreetMap](https://wiki.openstreetmap.org/wiki/QuadTiles) as well as
[Microsoft](https://msdn.microsoft.com/en-us/library/bb259689.aspx), I'm not
sure who was first.

## Usage

There is no good API documentation, but usage is pretty simple: `add` to add
things to the tree and `get` to look them up.

add takes a `{lat, lon}` object and some arbitrary payload.
get takes a `{x, y, zoom}` tile and will return all objects within.

See [the example code](example) for more.

## Contributing

Feel free to contribute via issues and PRs.

## License

MIT
