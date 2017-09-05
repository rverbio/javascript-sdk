require('core-js/es6/object');
require('core-js/es6/promise');

/*eslint-disable */
// Node List Pollyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// ToBlob PollyFill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {

      var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      callback(new Blob([arr], { type: type || 'image/png' }));
    }
  });
}
/*eslint-enable */

module.exports = require('./rverbio').default;
