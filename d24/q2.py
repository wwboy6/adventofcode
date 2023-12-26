import fileinput, re, z3
import math

recordCount = 5

datas = [ list( map( int, re.findall( "-?\d+", l ) ) )
      for index, l in enumerate(fileinput.input()) if index < recordCount ]

# print(datas)

def F(x):
  return [
    # pos                 vel                     time
    x[ai] - data[ai] + (x[ai+3] - data[ai+3]) * x[di + 6]
      for di, data in enumerate(datas) for ai in range(3) 
  ]

def J(x):
  return [
    # coef of pos
    [1 if ai2 == ai else 0 for ai2 in range(3)] +
    # coef of v
    # time
    [x[di + 6] if ai2 == ai else 0 for ai2 in range(3)] +
    # coef of time
    # vel         vel
    [x[ai + 3] - data[ai + 3] if di2 == di else 0 for di2 in range(recordCount) ]
      for di, data in enumerate(datas) for ai in range(3) 
  ]

# it is a myth to take a good x0
# at least ts cannot be the same to make a valid J
ts = ((i + 1) * 1 for i, _ in enumerate(range(recordCount)))
# currX = (0, 0, 0, 1, 2, 3, *ts)
# currX = (10, 20, 30, 100, 100, 100, *ts)
currX = (0, 0, 0, 0, 0, 0, *ts)

xLen = len(currX)
# print(F(x0))
# print( J(x0) )

def printMatrix(m):
  print(
    '\n'.join(
      [ ', '.join(map(str, (v for v in row))) for row in m ]
    )
  )

# epsilon = 0.1

def halfGE(f, j, isInv = False):
  rowCount = len(f)
  if not isInv:
    unusedRows = [i for i in range(rowCount)]
    colRange = range(xLen - 1)
  else:
    unusedRows = [i for i in reversed(range(rowCount))]
    colRange = reversed(range(1, xLen))
  for col in colRange:
    # search from top to bottom
    # print('col', col, 'unusedRows', unusedRows)
    tarRow = next((rr for rr in unusedRows if j[rr][col] != 0), -1)
    # # TODO: skip the value in very low magnitue
    # tarRow = next((rr for rr in unusedRows if abs(j[rr][col]) > epsilon), -1)
    if tarRow < 0:
      print(f)
      printMatrix(j)
      raise ValueError('no tarRow')
    if tarRow != col:
      # re-ordering
      f[col], f[tarRow] = f[tarRow], f[col]
      j[col], j[tarRow] = j[tarRow], j[col]
      tarRow = col
    unusedRows.remove(tarRow)
    value = j[tarRow][col]
    # normalize the row at tarI
    f[tarRow] /= value
    # print(f)
    j[tarRow] = [v / value for v in j[tarRow]]
    # reduce unusedRows
    for rr in unusedRows:
      factor = j[rr][col]
      if factor == 0: continue
      f[rr] -= factor * f[tarRow]
      j[rr] = [v - factor * j[tarRow][cc]  for cc, v in enumerate(j[rr])]

  # Newton's method
  # ref: https:#www.lakeheadu.ca/sites/default/files/uploads/77/docs/RemaniFinal.pdf
  # let the answer is a, b, c @ u, v, w
  # and it hit those 3 stones and t1, t2, t3:
  # pi + vi * ti = a + u * ti    for i = 0, 1, 2 => 9 equations
  #
  # x = [a, b, c, u, v, w, t0, t1, t2]
  #         _                        _ 
  #        | a - px0 + (u - vx0) * t0 |
  #        | b - py0 + (v - vy0) * t0 |
  #        | c - pz0 + (w - vz0) * t0 |
  #        | a - px1 + (u - vx1) * t1 |
  # F(x) = | b - py1 + (v - vy1) * t1 | = 0
  #        | c - pz1 + (w - vz1) * t1 |
  #        | a - px2 + (u - vx2) * t2 |
  #        | b - py2 + (v - vy2) * t2 |
  #        |_c - pz2 + (w - vz2) * t2_|
  #         _                                _
  #        | 1 0 0 t0  0  0 u-vx0     0     0 |
  #        | 0 1 0  0 t0  0 v-vy0     0     0 |
  #        | 0 0 1  0  0 t0 w-vz0     0     0 |
  #        | 1 0 0 t1  0  0     0 u-vx1     0 |
  # J(x) = | 0 1 0  0 t1  0     0 v-vy1     0 |
  #        | 0 0 1  0  0 t1     0 w-vz1     0 |
  #        | 1 0 0 t2  0  0     0     0 u-vx2 |
  #        | 0 1 0  0 t2  0     0     0 v-vy2 |
  #        |_0 0 1  0  0 t2     0     0 w-vz2_|
  #
  # Let x0 to be the middle of the volume [300000000000000, 300000000000000, 300000000000000]
  # with the avg speed of all stones avg(vi)
  # and set ti to be approcimate time from x0 to p0  
  # then solve this equation by gaussian elimination: J(x0)y0 = -F(x0)
  # and find x1 by x0 - J(x0)^-1 * F(x0)
threshold = 0.1
loop = 0
printInterval = 1000
while True:
  loop += 1
  f = F(currX)
  # print(f)
  # check if f is close to zero
  minAbsF = max( abs(fv) for fv in f )
  if minAbsF < threshold:
    print('minAbsF', minAbsF)
    break
  if loop % printInterval == 1: print('minAbsF', minAbsF)
  j = J(currX)
  # gaussian elimination
  # left to right, top to bottom
  halfGE(f, j)
  # right to left, bottom to top
  halfGE(f, j, True)
  if next((row for row in j for v in row if v != 0 and v != 1), None) != None:
    print('invalid j !')
    break 
  # if next((rr for rr, fv in enumerate(f) if math.isnan(fv)), -1) >= 0:
  #   print(f)
  #   printMatrix(j)
  #   raise Exception('nan')
  #
  # x1 = x0 - newF
  currX = [ currX[i] - f[i] for i in range(xLen) ]
  # assume the answer values are in integer
  # this can help merging to the answer
  currX = [ math.floor(i) for i in currX ]
  # print('currX', currX)

print('loop', loop)

print('****************************')
print(currX)
print(sum(currX[0:3]))
