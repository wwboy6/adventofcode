"use strict";

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('../lib/lib'),
    rFact = _require.rFact,
    compareObject = _require.compareObject;

var inputFilePath = 'input-test.txt'; // const inputFilePath = 'input.txt'
// const inputFilePath = 'test.txt'

var muteFlags = [true, true, true];

function coreFunction(data) {
  var result, checks, y, cy, tcy;
  return regeneratorRuntime.async(function coreFunction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          result = -1;
          checks = [true];
          y = 1;

        case 3:
          if (!(y < data.length)) {
            _context.next = 22;
            break;
          }

          cy = 0;

        case 5:
          if (!(cy < y)) {
            _context.next = 18;
            break;
          }

          if (checks[cy]) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("continue", 15);

        case 8:
          // const tcy = cy - (y - cy - 1)
          tcy = 2 * cy - y + 1;

          if (!(tcy < 0)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("continue", 15);

        case 11:
          if (cy === 2) debugLog1({
            y: y,
            cy: cy,
            tcy: tcy
          });
          if (cy === 2) debugLog1({
            yd: data[y],
            tcyd: data[tcy]
          });
          checks[cy] = compareObject(data[y], data[tcy]);
          if (cy === 2) debugLog1({
            check: checks[cy]
          });

        case 15:
          ++cy;
          _context.next = 5;
          break;

        case 18:
          if (y < data.length - 1) checks.push(true);

        case 19:
          ++y;
          _context.next = 3;
          break;

        case 22:
          debugLog1({
            checks: checks
          });
          result = checks.indexOf(true);
          _context.next = 26;
          return regeneratorRuntime.awrap(recordOutput([data], result));

        case 26:
          return _context.abrupt("return", result);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  });
}

function main() {
  var file, rl, data, sum, result, lineNo, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, newData, _loop, i;

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
          sum = 0;
          lineNo = -1;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _context2.prev = 7;
          _iterator = _asyncIterator(rl);

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(_iterator.next());

        case 11:
          _step = _context2.sent;
          _iteratorNormalCompletion = _step.done;
          _context2.next = 15;
          return regeneratorRuntime.awrap(_step.value);

        case 15:
          _value = _context2.sent;

          if (_iteratorNormalCompletion) {
            _context2.next = 47;
            break;
          }

          line = _value;
          ++lineNo;

          if (line) {
            _context2.next = 43;
            break;
          }

          debugLog('data');
          debugLog(data.map(function (line) {
            return line.join('');
          }).join('\n'));
          _context2.next = 24;
          return regeneratorRuntime.awrap(coreFunction(data));

        case 24:
          result = _context2.sent;
          debugLog({
            result: result
          });

          if (!(result >= 0)) {
            _context2.next = 31;
            break;
          }

          console.log((result + 1) * 100);
          sum += (result + 1) * 100;
          _context2.next = 41;
          break;

        case 31:
          // transpose
          newData = [];

          _loop = function _loop(i) {
            newData.push(data.map(function (d) {
              return d[i];
            }));
          };

          for (i = 0; i < data[0].length; ++i) {
            _loop(i);
          }

          debugLog('newData');
          debugLog(newData.map(function (line) {
            return line.join('');
          }).join('\n'));
          _context2.next = 38;
          return regeneratorRuntime.awrap(coreFunction(newData));

        case 38:
          result = _context2.sent;
          debugLog({
            result: result
          });

          if (result >= 0) {
            console.log(result + 1);
            sum += result + 1;
          } else {
            console.log('no ref', lineNo);
          }

        case 41:
          data = [];
          return _context2.abrupt("continue", 44);

        case 43:
          //
          data.push(line.split(''));

        case 44:
          _iteratorNormalCompletion = true;
          _context2.next = 9;
          break;

        case 47:
          _context2.next = 53;
          break;

        case 49:
          _context2.prev = 49;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 53:
          _context2.prev = 53;
          _context2.prev = 54;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context2.next = 58;
            break;
          }

          _context2.next = 58;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 58:
          _context2.prev = 58;

          if (!_didIteratorError) {
            _context2.next = 61;
            break;
          }

          throw _iteratorError;

        case 61:
          return _context2.finish(58);

        case 62:
          return _context2.finish(53);

        case 63:
          debugLog('hi');
          console.log('====');
          console.log({
            sum: sum
          });

        case 66:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 49, 53, 63], [54,, 58, 62]]);
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