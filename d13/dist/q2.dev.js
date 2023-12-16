"use strict";

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('../lib/lib'),
    rFact = _require.rFact,
    compareObject = _require.compareObject; // const inputFilePath = 'input-test.txt'


var inputFilePath = 'input.txt';
var muteFlags = [true, true, true];

function coreFunction(data) {
  var targetLine, result, checks, y, cy, check, tcy, diff, bi, newCheck;
  return regeneratorRuntime.async(function coreFunction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          targetLine = 0;
          result = -1;
          checks = [1]; // 1: perfect, 2: diff 1

          y = 1;

        case 4:
          if (!(y < data.length)) {
            _context.next = 36;
            break;
          }

          cy = 0;

        case 6:
          if (!(cy < y)) {
            _context.next = 32;
            break;
          }

          check = checks[cy];

          if (check) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("continue", 29);

        case 10:
          // const tcy = cy - (y - cy - 1)
          tcy = 2 * cy - y + 1;

          if (!(tcy < 0)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("continue", 29);

        case 13:
          if (cy === targetLine) debugLog1({
            y: y,
            cy: cy,
            tcy: tcy
          });
          if (cy === targetLine) debugLog1({
            yd: data[y],
            tcyd: data[tcy]
          }); // checks[cy] = compareObject(data[y], data[tcy])

          diff = 0;
          bi = 0;

        case 17:
          if (!(bi < data[y].length)) {
            _context.next = 24;
            break;
          }

          if (data[y][bi] !== data[tcy][bi]) ++diff;

          if (!(diff > 1)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("break", 24);

        case 21:
          ++bi;
          _context.next = 17;
          break;

        case 24:
          //
          newCheck = check;
          if (cy === targetLine) debugLog1({
            check: check,
            diff: diff
          });

          if (diff === 0) {// perfect
          } else if (diff === 1) {
            if (check === 1) newCheck = 2;else newCheck = false;
          } else {
            newCheck = false;
          }

          if (cy === targetLine) debugLog1({
            newCheck: newCheck
          });
          checks[cy] = newCheck;

        case 29:
          ++cy;
          _context.next = 6;
          break;

        case 32:
          if (y < data.length - 1) checks.push(1);

        case 33:
          ++y;
          _context.next = 4;
          break;

        case 36:
          debugLog1({
            checks: checks
          });
          result0 = checks.indexOf(1);
          result1 = checks.indexOf(2);
          _context.next = 41;
          return regeneratorRuntime.awrap(recordOutput([data], {
            result0: result0,
            result1: result1
          }));

        case 41:
          return _context.abrupt("return", {
            result0: result0,
            result1: result1
          });

        case 42:
        case "end":
          return _context.stop();
      }
    }
  });
}

function main() {
  var file, rl, data, sum, obj, result, lineNo, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, newData, _loop, i;

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
            _context2.next = 50;
            break;
          }

          line = _value;
          ++lineNo;

          if (line) {
            _context2.next = 46;
            break;
          }

          debugLog('data');
          debugLog(data.map(function (line) {
            return line.join('');
          }).join('\n'));
          _context2.next = 24;
          return regeneratorRuntime.awrap(coreFunction(data));

        case 24:
          obj = _context2.sent;
          debugLog({
            obj: obj
          });
          result = obj.result1;
          debugLog({
            result: result
          });

          if (!(result >= 0)) {
            _context2.next = 32;
            break;
          }

          sum += (result + 1) * 100;
          _context2.next = 44;
          break;

        case 32:
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
          _context2.next = 39;
          return regeneratorRuntime.awrap(coreFunction(newData));

        case 39:
          obj = _context2.sent;
          debugLog({
            obj: obj
          });
          result = obj.result1;
          debugLog({
            result: result
          });

          if (result >= 0) {
            sum += result + 1;
          } else {
            console.log('no ref', lineNo);
          }

        case 44:
          data = [];
          return _context2.abrupt("continue", 47);

        case 46:
          //
          data.push(line.split(''));

        case 47:
          _iteratorNormalCompletion = true;
          _context2.next = 9;
          break;

        case 50:
          _context2.next = 56;
          break;

        case 52:
          _context2.prev = 52;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 56:
          _context2.prev = 56;
          _context2.prev = 57;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context2.next = 61;
            break;
          }

          _context2.next = 61;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 61:
          _context2.prev = 61;

          if (!_didIteratorError) {
            _context2.next = 64;
            break;
          }

          throw _iteratorError;

        case 64:
          return _context2.finish(61);

        case 65:
          return _context2.finish(56);

        case 66:
          debugLog('hi');
          console.log('====');
          console.log({
            sum: sum
          });

        case 69:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 52, 56, 66], [57,, 61, 65]]);
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