'use strict';
var ty = (() => {
  var r = Object.defineProperty;
  var M = Object.getOwnPropertyDescriptor;
  var v = Object.getOwnPropertyNames;
  var x = Object.prototype.hasOwnProperty;
  var o = (e, n) => () => (e && (n = e((e = 0))), n);
  var B = (e, n) => () => (n || e((n = { exports: {} }).exports, n), n.exports),
    w = (e, n) => {
      for (var i in n) r(e, i, { get: n[i], enumerable: !0 });
    },
    J = (e, n, i, g) => {
      if ((n && typeof n == 'object') || typeof n == 'function')
        for (let t of v(n))
          !x.call(e, t) &&
            t !== i &&
            r(e, t, { get: () => n[t], enumerable: !(g = M(n, t)) || g.enumerable });
      return e;
    };
  var S = e => J(r({}, '__esModule', { value: !0 }), e);
  var a,
    l = o(() => {
      'use strict';
      a = () => typeof window < 'u' && typeof window.gzlJSBridge < 'u';
    });
  function b(e) {
    if (!e || !e.data)
      throw new Error('message is invalid, please check it format is { data: {} }');
    a()
      ? window.gzlJSBridge.webviewMessage('postMessage', JSON.stringify(e.data))
      : window.parent && window.parent.postMessage(e.data, '*');
  }
  function s(e) {
    let n = new MessageEvent('message', { data: e });
    typeof d == 'function' && d(n);
  }
  function F(e) {
    typeof f == 'function' && f(e);
  }
  function N(e) {
    d = e;
  }
  function h(e) {
    f = e;
  }
  var d,
    f,
    p = o(() => {
      'use strict';
      l();
      a()
        ? (window.gzlJSBridge.receiveMessageHandler = function (e) {
            try {
              if (typeof e.data == 'string') {
                let n = JSON.parse(e.data);
                s(n);
              } else s(e.data);
            } catch (n) {
              F(n);
            }
          })
        : typeof window < 'u' &&
          window.addEventListener('message', function (e) {
            let n = e.data;
            s(n);
          });
    });
  var c = {};
  w(c, { onError: () => h, onMessage: () => N, postMessage: () => b });
  var u = o(() => {
    'use strict';
    p();
  });
  var m = {};
  w(m, { miniProgram: () => c });
  var y = o(() => {
    'use strict';
    u();
  });
  var z = B((O, E) => {
    var { miniProgram: k } = (y(), S(m));
    E.exports = { miniProgram: k };
  });
  return z();
})();
