# ref: https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kepuq49/
import fileinput, re, itertools, fractions

h = [ list( map( int, re.findall( "-?\d+", l ) ) )
  for l in fileinput.input() ]
n = 0
# boundMin = 7
# boundMax = 27
boundMin = 200000000000000
boundMax = 400000000000000
for a, b in itertools.combinations( h, 2 ):
  apx, apy, apz, avx, avy, avz = a
  bpx, bpy, bpz, bvx, bvy, bvz = b
  d = avx * bvy - avy * bvx
  if d == 0:
    continue
  t = fractions.Fraction( ( bpx - apx ) * bvy - ( bpy - apy ) * bvx, d )
  u = fractions.Fraction( ( bpx - apx ) * avy - ( bpy - apy ) * avx, d )
  result = ( t >= 0 and u >= 0 and
    boundMin <= apx + t * avx <= boundMax and
    boundMin <= apy + t * avy <= boundMax )
  print(apx, apy, apz, '-', bpx, bpy, bpz, 'true' if result else 'false')
  n += result
print( n )
