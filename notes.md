tile zoom 0: just one tile, centered around N 0, E 0
tile zoom 1: 2x2 tiles
...

my task: given a tile and zoom level, find all geocaches in that tile

translate each coordinate into a number
bits alternate between x and y axis
and position is zoom level

then we have a single number per geocache
to lookup all geocaches:

1.  compute the "prefix" of the tile at the correct zoom level
2.  round down by cutting of significant bits
3.  this is the lower bound
4.  round up by filling insignificant bits
5.  this is the upper bound
6.  find all lower <= geocaches <= upper

tile 0,0 is "top-left"
