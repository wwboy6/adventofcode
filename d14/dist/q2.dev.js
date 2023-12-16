"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('../lib/lib'),
    rFact = _require.rFact,
    compareObject = _require.compareObject; // const inputFilePath = 'input-test.txt'


var inputFilePath = 'input.txt';
var muteFlags = [false, false, false]; // const muteFlags = [true, true, true, ]

function weight(data) {
  var lineCount = data.length;
  var sum = 0;

  for (var y = 0; y < data.length; ++y) {
    var lineWeight = lineCount - y;
    sum += data[y].filter(function (c) {
      return c === 'O';
    }).length * lineWeight;
  }

  return sum;
}

function dataToString(data) {
  return data.map(function (line) {
    return line.join('');
  }).join('\n');
}

var slideCache = {};

function slide(data) {
  var hash = dataToString(data);
  if (slideCache[hash]) return slideCache[hash]; //

  var width = data[0].length;

  for (var y = 1; y < data.length; ++y) {
    for (var x = 0; x < width; ++x) {
      if (data[y][x] !== 'O') continue; // search for upper space

      var resultY = y;

      for (var ty = y - 1; ty >= 0; --ty) {
        if (data[ty][x] !== '.') break;
        resultY = ty;
      } // roll


      data[y][x] = '.';
      data[resultY][x] = 'O';
    }
  } // TODO:
  // slideCache[hash] = data.map(line => [...line])
  // TODO: anti transform data for dir

}

var rotateCache = {};

function rotate(data) {
  var hash = dataToString(data);
  if (rotateCache[hash]) return rotateCache[hash]; //

  var newData = [];
  var lineCount = data.length;
  var width = data[0].length;

  for (var y = 0; y < width; ++y) {
    var newLine = [];

    for (var x = 0; x < lineCount; ++x) {
      newLine.push(data[lineCount - x - 1][y]);
    }

    newData.push(newLine);
  } // TODO:
  // rotateCache[hash] = newData.map(line => [...line])


  return newData;
}

function coreFunction(data) {
  var result;
  return regeneratorRuntime.async(function coreFunction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          slide(data);
          result = data; // await recordOutput([data], result)

          return _context.abrupt("return", result);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

function main() {
  var file, rl, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, cycleCount, result, cycleCache, cycle, hash, targetHash, lastCycleCount, cache, c, dir;

  return regeneratorRuntime.async(function main$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          file = fs.createReadStream(path.resolve(__dirname, inputFilePath));
          rl = readline.createInterface({
            input: file,
            crlfDelay: Infinity
          });
          data = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _context2.prev = 5;
          _iterator = _asyncIterator(rl);

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_iterator.next());

        case 9:
          _step = _context2.sent;
          _iteratorNormalCompletion = _step.done;
          _context2.next = 13;
          return regeneratorRuntime.awrap(_step.value);

        case 13:
          _value = _context2.sent;

          if (_iteratorNormalCompletion) {
            _context2.next = 20;
            break;
          }

          line = _value;
          data.push(line.split(''));

        case 17:
          _iteratorNormalCompletion = true;
          _context2.next = 7;
          break;

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 26:
          _context2.prev = 26;
          _context2.prev = 27;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context2.next = 31;
            break;
          }

          _context2.next = 31;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 31:
          _context2.prev = 31;

          if (!_didIteratorError) {
            _context2.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context2.finish(31);

        case 35:
          return _context2.finish(26);

        case 36:
          // const cycleCount = 3
          cycleCount = 1000000000;
          cycleCache = {};
          cycle = 0;

        case 39:
          if (!(cycle < cycleCount)) {
            _context2.next = 65;
            break;
          }

          hash = dataToString(data);
          if (cycle % 10000 === 0) console.log({
            cycle: cycle,
            rotateCache: Object.keys(rotateCache).length,
            slideCache: Object.keys(slideCache).length,
            cycleCache: Object.keys(cycleCache).length
          });

          if (!cycleCache[hash]) {
            _context2.next = 60;
            break;
          }

          console.log({
            cycle: cycle,
            rotateCache: Object.keys(rotateCache).length,
            slideCache: Object.keys(slideCache).length,
            cycleCache: Object.keys(cycleCache).length
          }); // data = cycleCache[hash]
          // continue
          // TODO: resolve loop!!

          targetHash = hash;
          loopCount = 1;

        case 46:
          if (!true) {
            _context2.next = 53;
            break;
          }

          targetHash = cycleCache[targetHash].to;

          if (!(targetHash === hash)) {
            _context2.next = 50;
            break;
          }

          return _context2.abrupt("break", 53);

        case 50:
          ++loopCount;
          _context2.next = 46;
          break;

        case 53:
          debugLog({
            loopCount: loopCount
          }); // jump cycle

          lastCycleCount = (cycleCount - cycle) % loopCount;
          debugLog({
            lastCycleCount: lastCycleCount
          });
          cache = cycleCache[hash]; // TODO:

          for (c = 0; c < lastCycleCount - 1; ++c) {
            cache = cycleCache[cache.to];
          }

          data = cache.data;
          return _context2.abrupt("break", 65);

        case 60:
          for (dir = 0; dir < 4; ++dir) {
            coreFunction(data); // slide

            data = rotate(data); // debugLog(data.map(line => line.join('')).join('\n'));
            // debugLog("===")
          } //
          // debugLog({result})
          // debugLog("===")


          cycleCache[hash] = {
            to: dataToString(data),
            data: data.map(function (line) {
              return _toConsumableArray(line);
            })
          }; // debugLog({cycle})
          // debugLog(dataToString(data))
          // debugLog("=====")

        case 62:
          ++cycle;
          _context2.next = 39;
          break;

        case 65:
          debugLog(dataToString(data));
          result = weight(data);
          console.log('===='); // console.log({sum})

          console.log({
            result: result
          });

        case 69:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 22, 26, 36], [27,, 31, 35]]);
} // ===========================


var outputFileName = "".concat(path.basename(__filename).split('.')[0], ".txt");

function debugLog() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  _debugLog.apply(void 0, [0].concat(args));
}

function debugLog1() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  _debugLog.apply(void 0, [1].concat(args));
}

function debugLog2() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  _debugLog.apply(void 0, [2].concat(args));
}

function _debugLog(flagI) {
  if (muteFlags[flagI]) return;

  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  console.log.apply(null, args);
}

var outputFile;

function recordOutput(args, output) {
  return regeneratorRuntime.async(function recordOutput$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (outputFile) {
            _context3.next = 4;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(fs.promises.open(path.resolve(__dirname, outputFileName), 'w'));

        case 3:
          outputFile = _context3.sent;

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(outputFile.appendFile("".concat(JSON.stringify({
            args: args,
            output: output
          }), "\n")));

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
} // ===========================


main();
module.exports = {
  coreFunction: coreFunction
};