# ref: https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kepuq49/
import fileinput, re, z3

h = [ list( map( int, re.findall( "-?\d+", l ) ) )
      for l in fileinput.input() ]

pxi, pyi, pzi, vxi, vyi, vzi = z3.Ints( "pxi pyi pzi vxi vyi vzi" )
ts = [ z3.Int( "t" + str( i ) ) for i in range( len( h ) ) ]

s = z3.Solver()
for i, ( px, py, pz, vx, vy, vz ) in enumerate( h ):
    s.add( px + vx * ts[ i ] == pxi + vxi * ts[ i ] )
    s.add( py + vy * ts[ i ] == pyi + vyi * ts[ i ] )
    s.add( pz + vz * ts[ i ] == pzi + vzi * ts[ i ] )
s.check()
print( s.model().evaluate( pxi + pyi + pzi ) )
