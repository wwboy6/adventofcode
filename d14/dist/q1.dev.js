"use strict";

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('../lib/lib'),
    rFact = _require.rFact,
    compareObject = _require.compareObject; // const inputFilePath = 'input-test.txt'


var inputFilePath = 'input.txt';
var muteFlags = [false, false, false];

function weigth(data) {
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

function slide(data) {
  // TODO: transform data for dir
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
  } // TODO: anti transform data for dir

}

function coreFunction(data) {
  var result;
  return regeneratorRuntime.async(function coreFunction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          slide(data);
          result = data;
          _context.next = 4;
          return regeneratorRuntime.awrap(recordOutput([data], result));

        case 4:
          return _context.abrupt("return", result);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function main() {
  var file, rl, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, result;

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
          coreFunction(data); // debugLog({data})
          // debugLog(data.map(line => line.join('')).join('\n'));

          result = weigth(data);
          console.log('===='); // console.log({sum})

          console.log({
            result: result
          });

        case 40:
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