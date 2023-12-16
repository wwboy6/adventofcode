"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('../lib/lib'),
    compareObject = _require.compareObject;

function canBeDamage(c) {
  return c === '#' || c === '?';
}

function canBeOp(c) {
  return c === '.' || c === '?';
}

var verbose = false;

function possibilityCount(spring, setup, tracing) {
  if (setup.length === 0) {
    if (verbose) console.log('reach end');
    var valid = spring.every(canBeOp);

    if (valid) {
      var newTracing = tracing + new Array(spring.length + 1).join('.');
      if (verbose) console.log({
        newTracing: newTracing
      });
    }

    return valid ? 1 : 0;
  }

  if (verbose) console.log({
    setup: setup
  });
  var targetCount = setup[0];
  var newSetup = setup.slice(1);
  if (verbose) console.log({
    targetCount: targetCount,
    newSetup: newSetup
  });
  var maxI = spring.length - newSetup.reduce(function (sum, c) {
    return sum + c + 1;
  }, 0) - targetCount; // const maxI = spring.length - (newSetup.reduce((sum, c) => sum + c + 1, 0))
  // const maxI = spring.length - 1

  if (verbose) console.log({
    spring: spring,
    maxI: maxI
  });
  var sum = 0;

  for (var i = 0; i <= maxI; ++i) {
    // check if i is possible for targetCount
    if (verbose) console.log({
      test: spring.slice(i, i + targetCount)
    });

    if ( // all # in range
    spring.slice(i, i + targetCount).every(canBeDamage) && // . before
    spring.slice(0, i).every(canBeOp) && ( // . after
    i + targetCount == spring.length || canBeOp(spring[i + targetCount]))) {
      var _newTracing = tracing;
      _newTracing += new Array(i).join('.');
      _newTracing += new Array(targetCount + 1).join('#');
      if (i + targetCount < spring.length) _newTracing += '.'; // check posibility of the rest

      sum += possibilityCount(spring.slice(i + targetCount + 1), newSetup, _newTracing);
    }

    if (verbose) console.log({
      targetCount: targetCount,
      maxI: maxI,
      i: i,
      sum: sum
    });
  }

  if (verbose) console.log({
    targetCount: targetCount,
    sum: sum
  });
  return sum;
}

function main() {
  var file, rl, sum, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, _line$match, _line$match2, _, spring, setup, data, count;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
          file = fs.createReadStream(path.resolve(__dirname, 'input.txt'));
          rl = readline.createInterface({
            input: file,
            crlfDelay: Infinity
          });
          sum = 0; // let datas = []

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _context.prev = 5;
          _iterator = _asyncIterator(rl);

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(_iterator.next());

        case 9:
          _step = _context.sent;
          _iteratorNormalCompletion = _step.done;
          _context.next = 13;
          return regeneratorRuntime.awrap(_step.value);

        case 13:
          _value = _context.sent;

          if (_iteratorNormalCompletion) {
            _context.next = 26;
            break;
          }

          line = _value;
          _line$match = line.match(/(.*?) (.*)/), _line$match2 = _slicedToArray(_line$match, 3), _ = _line$match2[0], spring = _line$match2[1], setup = _line$match2[2]; // double
          // spring = `${spring}?${spring}`
          // setup = `${setup},${setup}`
          // x5

          spring = "".concat(spring, "?").concat(spring, "?").concat(spring, "?").concat(spring, "?").concat(spring);
          setup = "".concat(setup, ",").concat(setup, ",").concat(setup, ",").concat(setup, ",").concat(setup);
          data = {
            spring: spring.replace(/\.+/g, '.').replace(/^\.|\.$/g, '').split(''),
            setup: setup.split(',').map(function (c) {
              return Number.parseInt(c);
            })
          }; // datas.push(data)
          // console.log({data})

          count = possibilityCount(data.spring, data.setup, '');
          console.log("".concat(data.spring.join(''), " ").concat(data.setup, " ").concat(count));
          sum += count;

        case 23:
          _iteratorNormalCompletion = true;
          _context.next = 7;
          break;

        case 26:
          _context.next = 32;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 32:
          _context.prev = 32;
          _context.prev = 33;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context.next = 37;
            break;
          }

          _context.next = 37;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 37:
          _context.prev = 37;

          if (!_didIteratorError) {
            _context.next = 40;
            break;
          }

          throw _iteratorError;

        case 40:
          return _context.finish(37);

        case 41:
          return _context.finish(32);

        case 42:
          console.log('====');
          console.log({
            sum: sum
          });

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 28, 32, 42], [33,, 37, 41]]);
}

main();