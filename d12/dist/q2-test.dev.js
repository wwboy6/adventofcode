"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var fs = require('fs');

var readline = require('readline');

var path = require('path');

var _require = require('process'),
    off = _require.off; // const { compareObject } = require('../lib/lib')


function canBeDamage(c) {
  return c === '#' || c === '?';
}

function canBeOp(c) {
  return c === '.' || c === '?';
}

var verbose = true;
var verbose1 = false;

function rFact(num) {
  if (num === 0) {
    return 1;
  } else {
    return num * rFact(num - 1);
  }
}

function resolveGroups(groups, setup) {
  if (!groups.length) {
    return setup.length ? 0 : 1;
  } // one possibility for no setup: all .


  if (!setup.length) return 1; // TODO: shortcut: spring.len >= sum setup
  // TODO: try all combination of setup with first group, and recursion for the rest

  var firstGroup = groups[0];
  var newGroup = groups.slice(1);
  if (verbose) console.log({
    firstGroup: firstGroup,
    newGroup: newGroup
  });
  var sum = 0;

  for (var size = 0; size <= setup.length; ++size) {
    var newSetup = setup.slice(0, size);
    if (verbose) console.log({
      newSetup: newSetup
    }); // check possibility for first group

    var space = firstGroup - (size - 1) - newSetup.reduce(function (sum, c) {
      return sum + c;
    }, 0);
    if (space < 0) break;
    var combination = void 0;
    if (newSetup.length === 0 || space === 0) combination = 1;else {
      var slot = newSetup.length + 1;
      if (verbose) console.log({
        space: space,
        slot: slot
      }); // combination of space aginst slot
      // https://en.wikipedia.org/wiki/Stars_and_bars_(combinatorics)

      var n = space + slot - 1;
      var r = slot - 1; // C(n,r) = n! ( (n-r)! r! )

      combination = rFact(n) / rFact(n - r) / rFact(r);
      if (verbose) console.log({
        combination: combination
      });
    }
    var possOfRest = resolveGroups(newGroup, setup.slice(size));
    if (verbose) console.log({
      possOfRest: possOfRest
    });
    sum += combination * possOfRest;
  }

  if (verbose) console.log({
    groups: groups,
    setup: setup,
    sum: sum
  });
  return sum;
} // count with no known damage left


function possibilityCount(spring, setup) {
  if (verbose) console.log({
    spring: spring,
    setup: setup,
    len: setup.length
  }); // one possibility for no setup: all .

  if (!setup.length) return 1; //

  var groups = spring.split('.').map(function (str) {
    return str.length;
  });
  if (verbose) console.log({
    groups: groups
  });
  return resolveGroups(groups, setup);
}

function reduceKnownDamage(spring, setup, level) {
  if (!level) level = 0; // find first #
  // TODO: finish it in 1 op

  var index = spring.indexOf('#'); // check if no known damage left

  if (index < 0) return possibilityCount(spring, setup); // possibilities is 0 if # exist without setup

  if (!setup.length) return 0;
  var length = spring.match(/#+/)[0].length;
  if (verbose) console.log({
    index: index,
    length: length
  }); // match all possibilities with setup

  var sum = 0;

  for (var i = 0; i < setup.length; ++i) {
    var targetCount = setup[i];

    for (var offset = length - targetCount; offset <= 0; ++offset) {
      // check if the range meet requirement
      var newIndex = index + offset;
      if (verbose) console.log({
        i: i,
        offset: offset,
        newIndex: newIndex
      });

      if (_toConsumableArray(spring.slice(newIndex, newIndex + length)).every(canBeDamage) && ( // . before - must be true
      // . after
      newIndex + targetCount == spring.length || canBeOp(spring[newIndex + targetCount]))) {
        // split spring / setup into 2 parts
        var newSpring = spring.slice(0, newIndex);
        var newSetup = setup.slice(0, i);
        var possibilities0 = reduceKnownDamage(newSpring, newSetup, level + 1);
        if (verbose && level === 0) console.log({
          newSpring: newSpring,
          newSetup: newSetup,
          possibilities0: possibilities0
        });
        if (!possibilities0) continue;
        newSpring = spring.slice(newIndex + targetCount + 1);
        newSetup = setup.slice(i + 1);
        var possibilities1 = reduceKnownDamage(newSpring, newSetup, level + 1);
        if (verbose && level === 0) console.log({
          newSpring: newSpring,
          newSetup: newSetup,
          possibilities1: possibilities1
        });
        if (verbose && level === 0) console.log({
          add: possibilities0 * possibilities1
        });
        sum += possibilities0 * possibilities1;
      }
    }
  }

  return sum;
}

function main() {
  var file, rl, sum, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, _line$match, _line$match2, _, spring, setup, spring2, setupArr, data, count;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt')); // const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))

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
          _line$match = line.match(/(.*?) (.*)/), _line$match2 = _slicedToArray(_line$match, 3), _ = _line$match2[0], spring = _line$match2[1], setup = _line$match2[2];
          spring2 = spring.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
          setupArr = setup.split(',').map(function (c) {
            return Number.parseInt(c);
          }); // spring2 = `${spring2}?${spring2}?${spring2}?${spring2}?${spring2}`
          // setupArr = [...setupArr, ...setupArr, ...setupArr, ...setupArr, ...setupArr]

          data = {
            spring: spring2,
            setup: setupArr
          }; // datas.push(data)
          // console.log({data})

          count = reduceKnownDamage(data.spring, data.setup);
          console.log({
            spring: spring,
            count: count
          });
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

main(); // resolveGroups([7], [1, 1, 1])